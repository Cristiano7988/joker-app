export const Page = ({ page }) => {
    return <main className="Main">
    <div className="Div">
      <div className="Div">
        <h1 className="H1">{page.title}</h1>
        <hr className="Hr"/>
      </div>
      <div className="Figure">
        <img className="Img" src={process.env.REACT_APP_DIRECTUS_URL + "/assets/" + page.featured_image} />
        <svg width="100" height="400" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H100L0 400V0Z" fill="#896E52"/></svg>

      </div>
    </div>
    <div className="Div" dangerouslySetInnerHTML={{  __html: page.description}} />
  </main>
}
