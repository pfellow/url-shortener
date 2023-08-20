import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

const Copy = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <Popover>
        <PopoverTrigger>
          <svg
            width='50px'
            height='50px'
            viewBox='0 0 1024 1024'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            fill='#E29E21'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path
                d='M589.3 260.9v30H371.4v-30H268.9v513h117.2v-304l109.7-99.1h202.1V260.9z'
                fill='#FFFFFF'
              ></path>
              <path
                d='M516.1 371.1l-122.9 99.8v346.8h370.4V371.1z'
                fill='#FFFFFF'
              ></path>
              <path d='M752.7 370.8h21.8v435.8h-21.8z' fill='#E29E21'></path>
              <path d='M495.8 370.8h277.3v21.8H495.8z' fill='#E29E21'></path>
              <path d='M495.8 370.8h21.8v124.3h-21.8z' fill='#E29E21'></path>
              <path
                d='M397.7 488.7l-15.4-15.4 113.5-102.5 15.4 15.4z'
                fill='#E29E21'
              ></path>
              <path d='M382.3 473.3h135.3v21.8H382.3z' fill='#E29E21'></path>
              <path
                d='M382.3 479.7h21.8v348.6h-21.8zM404.1 806.6h370.4v21.8H404.1z'
                fill='#E29E21'
              ></path>
              <path
                d='M447.7 545.1h261.5v21.8H447.7zM447.7 610.5h261.5v21.8H447.7zM447.7 675.8h261.5v21.8H447.7z'
                fill='#E29E21'
              ></path>
              <path d='M251.6 763h130.7v21.8H251.6z' fill='#E29E21'></path>
              <path
                d='M251.6 240.1h21.8v544.7h-21.8zM687.3 240.1h21.8v130.7h-21.8zM273.4 240.1h108.9v21.8H273.4z'
                fill='#E29E21'
              ></path>
              <path
                d='M578.4 240.1h130.7v21.8H578.4zM360.5 196.5h21.8v108.9h-21.8zM382.3 283.7h196.1v21.8H382.3zM534.8 196.5h65.4v21.8h-65.4z'
                fill='#E29E21'
              ></path>
              <path
                d='M360.5 196.5h65.4v21.8h-65.4zM404.1 174.7h152.5v21.8H404.1zM578.4 196.5h21.8v108.9h-21.8z'
                fill='#E29E21'
              ></path>
            </g>
          </svg>
        </PopoverTrigger>
        <PopoverContent>Copied!</PopoverContent>
      </Popover>
    </div>
  );
};

export default Copy;
