/**
 * Failed Test Retry Script
 *
 * JUnit XML 리포트에서 실패한 테스트를 파싱하고, 해당 테스트만 재실행한다.
 * 최대 MAX_RETRIES 횟수만큼 재시도하며, 모든 테스트가 통과하면 종료한다.
 *
 * 사용법: node scripts/failed-test-retry.js
 *
 * 필요 조건:
 *   - jest-junit 리포터가 설정되어 ./test-results/junit-report.xml 생성
 *   - Jest가 --forceExit --runInBand 옵션으로 실행 가능
 */

const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');

const MAX_RETRIES = 3;
const REPORT_DIR = resolve(__dirname, '../test-results');
const REPORT_FILE = resolve(REPORT_DIR, 'junit-report.xml');

/**
 * JUnit XML에서 실패한 테스트 파일 경로를 추출한다.
 * <testsuite> 태그의 failures > 0 인 항목에서 file 경로를 가져온다.
 */
function getFailedTestFiles(xmlPath) {
  if (!existsSync(xmlPath)) {
    console.error(`JUnit report not found: ${xmlPath}`);
    return [];
  }

  const xml = readFileSync(xmlPath, 'utf-8');
  const failedFiles = new Set();

  // <testsuite name="..." failures="N" ... file="path/to/test.spec.ts">
  const testsuiteRegex = /<testsuite[^>]*failures="(\d+)"[^>]*file="([^"]+)"[^>]*>/g;
  let match;

  while ((match = testsuiteRegex.exec(xml)) !== null) {
    const failures = parseInt(match[1], 10);
    const file = match[2];
    if (failures > 0 && file) {
      failedFiles.add(file);
    }
  }

  // file이 failures 앞에 올 수도 있으므로 역순도 체크
  const testsuiteRegex2 = /<testsuite[^>]*file="([^"]+)"[^>]*failures="(\d+)"[^>]*>/g;
  while ((match = testsuiteRegex2.exec(xml)) !== null) {
    const file = match[1];
    const failures = parseInt(match[2], 10);
    if (failures > 0 && file) {
      failedFiles.add(file);
    }
  }

  return Array.from(failedFiles);
}

/**
 * 실패한 테스트 파일만 재실행한다.
 * 성공하면 true, 실패하면 false를 반환한다.
 */
function runFailedTests(files) {
  const testPathPattern = files
    .map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  try {
    execSync(
      `npx jest --forceExit --runInBand --testPathPattern="${testPathPattern}"`,
      { stdio: 'inherit', cwd: resolve(__dirname, '..') },
    );
    return true;
  } catch {
    return false;
  }
}

// Main
function main() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`\n=== Retry failed tests (attempt ${attempt}/${MAX_RETRIES}) ===\n`);

    const failedFiles = getFailedTestFiles(REPORT_FILE);

    if (failedFiles.length === 0) {
      console.log('No failed test files found in report. Exiting.');
      process.exit(1);
    }

    console.log(`Failed test files (${failedFiles.length}):`);
    failedFiles.forEach(f => console.log(`  - ${f}`));

    const success = runFailedTests(failedFiles);

    if (success) {
      console.log(`\nAll failed tests passed on retry attempt ${attempt}.`);
      process.exit(0);
    }

    if (attempt < MAX_RETRIES) {
      console.log(`\nRetry attempt ${attempt} failed. Trying again...`);
    }
  }

  console.error(`\nAll ${MAX_RETRIES} retry attempts failed.`);
  process.exit(1);
}

main();
