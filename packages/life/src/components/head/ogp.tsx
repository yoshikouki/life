import { isAuthor, isError, isHome, isPost, isPostType, isTerm } from "@frontity/source";
import { Data } from "@frontity/source/types";
import { connect, decode, Head, useConnect } from "frontity";
import { Packages } from "../../../types";

const Title = ({ data }: {data: Data}): JSX.Element => {
  const { state } = useConnect<Packages>();
  const url = (state.frontity.url.endsWith("/") ? state.frontity.url.slice(0, -1) : state.frontity.url) + state.router.link

  let contentType = "website"
  if (isPost(data)) {
    contentType = "article"
  }
  const description = state.frontity.description
  let title = state.frontity.title;
  if (isHome(data)) {
    title = `${state.frontity.title} - yoshikouki`;
  } else if (isTerm(data)) {
    // Add titles to taxonomies, like "Category: Nature - Blog Name" or "Tag: Japan - Blog Name".
    // 1. Get the taxonomy entity from the state to get its taxonomy term and name.
    const { taxonomy, name } = state.source[data.taxonomy][data.id];
    // 2. Uppercase first letter of the taxonomy term (from "category" to "Category").
    const taxonomyCapitalized =
      taxonomy.charAt(0).toUpperCase() + taxonomy.slice(1);
    // 3. Render the proper title.
    title = `${taxonomyCapitalized}: ${decode(name)} - ${state.frontity.title}`;
  } else if (isAuthor(data)) {
    // Add titles to authors, like "Author: Jon Snow - Blog Name".
    // 1. Get the author entity from the state to get its name.
    const { name } = state.source.author[data.id];
    // 2. Render the proper title.
    title = `Author: ${decode(name)} - ${state.frontity.title}`;
  } else if (isPostType(data)) {
    // Add titles to posts and pages, using the title and ending with the Blog Name.
    // 1. Get the post entity from the state and get its title.
    const postTitle = state.source[data.type][data.id].title.rendered;
    // 2. Remove any HTML tags found in the title.
    const cleanTitle = decode(postTitle);
    // 3. Render the proper title.
    title = `${cleanTitle} - ${state.frontity.title}`;
  } else if (isError(data) && data.is404) {
    // Add titles to 404's.
    title = `404 Not Found - ${state.frontity.title}`;
  }

  return (
    <Head>
      <meta property="og:url" content={url} />
      <meta property="og:type" content={contentType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://www.gravatar.com/avatar/a6c581d156d86d79ea83cbbccdfebbe0?s=800&r=g" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@yoshikouki_" />
    </Head>
  );
};

export default connect(Title);
