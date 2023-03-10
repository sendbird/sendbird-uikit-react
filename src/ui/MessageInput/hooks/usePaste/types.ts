export type Word = {
  text: string;
  userId?: string;
};

export type DynamicProps = {
  ref: React.RefObject<HTMLDivElement>;
  setUniqueUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: () => void;
};
