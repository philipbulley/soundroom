import { Story } from '@storybook/react';

declare module '@storybook/react' {
  interface Story {
    addWithInfo (storyName: string, storyDescription: string, callback: Function, options?: any): Story;
  }
}
