import type { Meta, StoryObj } from '@storybook/react';
import Card from '../components/ui/Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass'],
    },
    animate: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="w-[300px]">
        <h2 className="text-xl font-bold mb-2">Card Title</h2>
        <p className="text-white/70">
          This is a default card component with some sample content to demonstrate
          the layout and styling.
        </p>
      </div>
    ),
    variant: 'default',
  },
};

export const Glass: Story = {
  args: {
    children: (
      <div className="w-[300px]">
        <h2 className="text-xl font-bold mb-2">Glass Card</h2>
        <p className="text-white/70">
          This card uses a glass morphism effect with backdrop blur and
          transparency.
        </p>
      </div>
    ),
    variant: 'glass',
  },
};

export const Animated: Story = {
  args: {
    children: (
      <div className="w-[300px]">
        <h2 className="text-xl font-bold mb-2">Animated Card</h2>
        <p className="text-white/70">
          This card animates when it enters the viewport using Framer Motion.
        </p>
      </div>
    ),
    animate: true,
  },
};