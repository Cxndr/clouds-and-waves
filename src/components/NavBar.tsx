import * as NavigationMenu from "@radix-ui/react-navigation-menu";


export default function NavBar() {

  return (
  <NavigationMenu.Root className="self-end">
    <NavigationMenu.List className="flex flex-row justify-center flex-grow gap-2">

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/feed" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Feed
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      {/* <NavigationMenu.Item>
        <NavigationMenu.Link href="/charts" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Charts
        </NavigationMenu.Link>
      </NavigationMenu.Item> */}

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/profile" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Profile
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/saved" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Saved
        </NavigationMenu.Link>
      </NavigationMenu.Item>


      {/* <NavigationMenu.Item>
        <NavigationMenu.Link href="/search" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Search
        </NavigationMenu.Link>
      </NavigationMenu.Item> */}

      <NavigationMenu.Indicator />
    </NavigationMenu.List>

		<NavigationMenu.Viewport />
	</NavigationMenu.Root>
  )
}  

