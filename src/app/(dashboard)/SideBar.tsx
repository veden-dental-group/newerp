'use client';
import Tree, { TreeDTO } from '@/components/Tree';
import { Button } from '@/components/ui/button';

import { IoLogOutOutline } from 'react-icons/io5';
import { BiLayerMinus } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';

import Link from 'next/link';

import _ from 'lodash';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  treeArray: TreeDTO[];
};

const SideBar: React.FC<Props> = ({ treeArray }) => {
  const [collapse, setCollapse] = useState(false);
  const [showList, setShowList] = useState(false);
  const triggerCollapse = () => setCollapse(!collapse);

  useEffect(() => {
    if (!collapse) {
      setTimeout(() => {
        setShowList(false);
      }, 500);
    } else {
      setShowList(true);
    }
  }, [collapse]);

  return (
    <div
      id="sidebar"
      className={twMerge(
        'relative h-[100dvh] w-48 bg-primary text-white transition-all duration-700',
        collapse ? 'w-0' : 'w-48',
      )}
    >
      <Button
        variant={'pureIcon'}
        size={'smicon'}
        className="absolute -right-2 top-[50%] h-16 w-2 translate-y-[-50%]"
        onClick={triggerCollapse}
      >
        {collapse ? (
          <FaCaretRight className="h-16 w-2 cursor-pointer bg-primary/30 p-0 text-white hover:bg-primary/60" />
        ) : (
          <FaCaretLeft className="h-16 w-2 cursor-pointer bg-primary/30 p-0 text-white hover:bg-primary/60" />
        )}
      </Button>
      <div className={twMerge('h-full px-2 pb-4', showList ? 'hidden' : 'flex flex-col')}>
        <div className="flex shrink-0 flex-col py-6">
          <span className="px-2 text-xl">Veden ERP</span>
          <span className="px-2 text-base">用戶：dev</span>
          <span className="px-2 text-base">廠別：VD210</span>
          <div className="flex justify-start">
            <Link href={'/'} className="h-10 w-10 p-2 hover:text-pin">
              <FaHome className="h-6 w-6" />
            </Link>
            <Link href={'/orderstemp'} className="h-10 w-10 p-2 hover:text-pin">
              <BiLayerMinus className="h-6 w-6" />
            </Link>
            <Link href={'/logout'} className="h-10 w-10 p-2 hover:text-pin">
              <IoLogOutOutline className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          <Tree data={treeArray} />
        </div>
      </div>
    </div>
  );
};
export default SideBar;
