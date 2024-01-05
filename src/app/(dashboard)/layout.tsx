import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Tree, { TreeDTO } from '@/components/Tree';
import { groupBy } from 'lodash';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const res = await fetch(process.env.ROOT_URL + '/api/sy/menu');
  const { result }: { result: TreeDTO[] } = await res.json();
  // const treeMenu = result.map((el)=>{
  //   if(el.PARENT_MENU_ID){

  //   }else{
  //     return el;
  //   }
  // })

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[100dvw] overflow-hidden bg-secondary/50">
      <div id="sidebar" className="flex min-h-[100dvh] min-w-[13rem] flex-col justify-between bg-primary text-white">
        {/* <Tree data={treeMenu} /> */}
      </div>
      <div className="mx-0 flex w-full flex-col">{children}</div>
    </div>
  );
}
