// this componennt makes custom tailwind variables available for use as background images elsewhere in components.


export default function GenreTags() {

  return (
    <>
      <span aria-hidden className="bg-gcloud bg-gdnb bg-gtrap bg-ghouse bg-gphonk bg-gvaporwave bg-gfuturefunk bg-gsynthwave bg-glofi bg-[url('/img/genre-bg/cloud.jpg')] bg-[url('/img/genre-bg/dnb.jpg')] bg-[url('/img/genre-bg/trap.jpg')] bg-[url('/img/genre-bg/house.jpg')] bg-[url('/img/genre-bg/phonk.jpg')] bg-[url('/img/genre-bg/vaporwave.jpg')] bg-[url('/img/genre-bg/futurefunk.jpg')] bg-[url('/img/genre-bg/synthwave.jpg')] bg-[url('/img/genre-bg/lofi.jpg')]"></span> {/* silly fake element to load the genre tags in tailwind, they don't load via template literals unless we have already loaded without. */}
    </>
  )

}