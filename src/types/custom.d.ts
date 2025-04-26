import { ButtonProps } from 'react-bootstrap';
import { LinkProps } from 'react-router-dom';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

declare module 'react-bootstrap' {
  export interface ButtonProps {
    as?: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> | string;
    to?: string;
  }
} 