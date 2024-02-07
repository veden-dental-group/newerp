import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Tree, { TreeDTO } from '@/components/Tree';
import { IoLogOutOutline } from 'react-icons/io5';
import { BiLayerMinus } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';

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
      <div
        id="sidebar"
        className="flex h-full min-h-[100dvh] min-w-[10rem] flex-col overflow-y-auto bg-primary px-2 text-white"
      >
        <div className="flex flex-col py-6">
          <span className="px-2 text-2xl">New ERP</span>
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
        <Tree data={newArray} />
      </div>
      <div className="mx-0 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}
