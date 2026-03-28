// types/tiptap.d.ts
import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: string;
        align?: 'left' | 'center' | 'right';
      }) => ReturnType;
      updateAttributes: (attributes: {
        width?: string;
        align?: 'left' | 'center' | 'right';
      }) => ReturnType;
    };
  }
}