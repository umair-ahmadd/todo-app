
export default function Navbar() {
    return (
    <nav className="flex sticky top-0 bg-gray-100/40 backdrop-blur-lg  items-center justify-between py-2 px-8 text-white">
      <div className="text-3xl font-extrabold text-sky-500">Todo Logo</div> 
      <div>
        <ul className="flex font-bold">
          <li className="hover:bg-gray-100/30 hover:backdrop-blur-md p-2 px-5 rounded-lg"><a href="/">Home</a></li>
          <li className="hover:bg-gray-100/30 hover:backdrop-blur-md p-2 px-5 rounded-lg"><a href="/about">About</a></li>
          <li className="hover:bg-gray-100/30 hover:backdrop-blur-md p-2 px-5 rounded-lg"  ><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
    )
}