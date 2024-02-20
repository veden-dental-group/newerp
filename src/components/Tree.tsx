'use client';
import React, { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export type TreeDTO = {
  MENU_ID: number;
  COMPANY_ID: number;
  MENU_CATEGORY_ID: number;
  MENU_CODE: string;
  MENU_NAME: string;
  PARENT_MENU_ID?: any;
  SORTING: number;
  MENU_STATUS: string;
  children?: TreeDTO[];
};

function Tree({ data }: { data: TreeDTO[] | TreeDTO }) {
  return (
    <ul role="list" className="space-y-1">
      {data instanceof Array ? (
        data.map((item, i) => (
          <li key={item.MENU_ID}>
            {item.children ? (
              <AccordionPrimitive.Root type="single" collapsible>
                <AccordionPrimitive.Item value={item.MENU_CODE}>
                  <AccordionTrigger>{item.MENU_NAME}</AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <Tree data={item.children ? item.children : item} />
                  </AccordionContent>
                </AccordionPrimitive.Item>
              </AccordionPrimitive.Root>
            ) : (
              <Leaf name={item.MENU_NAME} code={item.MENU_CODE} />
            )}
          </li>
        ))
      ) : (
        <li>
          <Leaf name={data.MENU_NAME} code={data.MENU_CODE} />
        </li>
      )}
    </ul>
  );
}

export default Tree;

function Leaf({ name, code }: { name: string; code: string }) {
  return (
    <a href={`/${code}`} className={'flex flex-1 items-center py-1 font-medium hover:scale-105 hover:underline'}>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-0" />
      {name}
    </a>
  );
}
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center py-1 font-medium transition-all first:[&[data-state=open]>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-xs transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
  >
    <div className="pb-2 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
