# to do: index.css cannot be bundled into ./dist using rollup.json
# Also, rollup-copy is not working synchronously
# Solution - for v3, we should change the bundling position/import of CSS
mkdir dist
cp ./release/dist/index.css ./dist/index.css
