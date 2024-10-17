import * as NavigationMenu from "@radix-ui/react-navigation-menu";


export default function NavBar() {

  return (
  <NavigationMenu.Root className="self-end absolute left-1/2 -translate-x-1/2 text-4xl">
    <NavigationMenu.List className="flex flex-row justify-center flex-grow gap-2">

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/feed" className="p-4 pb-5 block hover:scale-110 transition-all duration-300 hover:text-[indianred]">
          Feed
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      {/* <NavigationMenu.Item>
        <NavigationMenu.Link href="/charts" className="pb-0.5 pt-1.5 px-4 block bg-slate-500 rounded-t-xl">
          Charts
        </NavigationMenu.Link>
      </NavigationMenu.Item> */}

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/profile" className="p-4 pb-5 block hover:scale-110 transition-all duration-300 hover:text-[indianred]">
          Profile
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/saved" className="p-4 pb-5 block hover:scale-110 transition-all duration-300 hover:text-[indianred]">
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

