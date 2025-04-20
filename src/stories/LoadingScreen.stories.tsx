import type { Meta, StoryObj } from '@storybook/react';
import LoadingScreen from '../components/ui/LoadingScreen';

const meta = {
  title: 'UI/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};