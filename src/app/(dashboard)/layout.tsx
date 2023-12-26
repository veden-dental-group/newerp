import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();
	if (!session?.user) redirect("/login");
	return (
		<div className="flex flex-col relative min-h-[100dvh] w-full max-w-[100dvw] overflow-hidden bg-secondary/50">
			<Menubar className="w-full h-12 sticky top-0 left-0">
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>
							New Tab <MenubarShortcut>⌘T</MenubarShortcut>
						</MenubarItem>
						<MenubarItem>
							New Window <MenubarShortcut>⌘N</MenubarShortcut>
						</MenubarItem>
						<MenubarItem disabled>New Incognito Window</MenubarItem>
						<MenubarSeparator />
						<MenubarSub>
							<MenubarSubTrigger>Share</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>Email link</MenubarItem>
								<MenubarItem>Messages</MenubarItem>
								<MenubarItem>Notes</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
						<MenubarSeparator />
						<MenubarItem>
							Print... <MenubarShortcut>⌘P</MenubarShortcut>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Functions</MenubarTrigger>
					<MenubarContent>
						<MenubarItem inset><Link href={"/rawquery"}>Query</Link></MenubarItem>
						<MenubarSeparator />
						<MenubarItem inset><Link href={"/logout"}>Log Out</Link></MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<div className="mx-0 flex w-full flex-col">{children}</div>
		</div>
	);
}
