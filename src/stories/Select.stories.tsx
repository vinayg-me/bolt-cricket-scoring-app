import type { Meta, StoryObj } from '@storybook/react';
import Select from '../components/ui/Select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Select Option',
    options: defaultOptions,
  },
};

export const WithError: Story = {
  args: {
    label: 'Select Option',
    options: defaultOptions,
    error: 'Please select an option',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: defaultOptions,
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Select',
    options: defaultOptions,
    fullWidth: true,
  },
};

export const WithPlayerRoles: Story = {
  args: {
    label: 'Player Role',
    options: [
      { value: 'Batsman', label: 'Batsman' },
      { value: 'Bowler', label: 'Bowler' },
      { value: 'All Rounder', label: 'All Rounder' },
      { value: 'Keeper', label: 'Keeper' },
    ],
  },
};