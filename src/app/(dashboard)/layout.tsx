import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Tree, { TreeDTO } from '@/components/Tree';
import SideBar from './SideBar';

import { IoLogOutOutline } from 'react-icons/io5';
import { BiLayerMinus } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';

import Link from 'next/link';

import _ from 'lodash';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const res = await fetch(process.env.ROOT_URL + '/api/sys/menu');
  const { result }: { result: TreeDTO[] } = await res.json();

  const createNestedArray = (data: TreeDTO[]): TreeDTO[] => {
    const groupedData = _.groupBy(data, 'MENU_ID');

    const nestedArray = _.map(groupedData, (item) => {
      const firstItem = item[0];

      if (firstItem.PARENT_MENU_ID) {
        const parent = groupedData[firstItem.PARENT_MENU_ID];
        if (parent) {
          parent[0].children = [...(parent[0].children || []), firstItem];
          return null;
        }
      }
      return firstItem;
    });
    const finalArray = _.compact(nestedArray);

    return finalArray;
  };
  const newArray: TreeDTO[] = createNestedArray(result);

  return (
    <div className="relative flex max-h-[100dvh] w-full max-w-[100dvw] bg-secondary/50">
      <SideBar treeArray={newArray} />
      <div className="mx-0 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
