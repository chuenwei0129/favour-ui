import React, { ButtonHTMLAttributes } from 'react';
import Icon from '../../../components/Icon';
import { StyledButton } from './StyledButton';

export const Decrement = ({
  icon = 'minus',
  onClick,
  ...rest
}: {
  icon: 'minus' | 'circle-minus' | 'square-minus';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <StyledButton onClick={onClick} {...rest}>
      <Icon icon={icon} variant={'primary'}></Icon>
    </StyledButton>
  );
};

Decrement.displayName = 'Decrement';
