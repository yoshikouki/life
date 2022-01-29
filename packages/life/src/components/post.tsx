import {
  isAttachmentEntity,
  isPageEntity,
  isPostEntity
} from "@frontity/source";
import { PostTypeData, PostTypeEntity } from "@frontity/source/types";
import { connect, styled, useConnect } from "frontity";
import { useEffect } from "react";
import { Packages } from "../../types";
import Content from "./content";
import FeaturedMedia from "./featured-media";
import Link from "./link";
import List from "./list";

/**
 * Properties received by the `Post` component.
 */
interface PostProps {
  /**
   * Data element representing a URL in your frontity site.
   */
  data: PostTypeData;

  /**
   * Whether to render this component.
   */
  when?: boolean;
}

/**
 * The Post component that Mars uses to render any kind of "post type", like
 * posts, pages, attachments, etc.
 *
 * It doesn't receive any prop but the Frontity store, which it receives from
 * {@link connect}. The current Frontity state is used to know which post type
 * should be rendered.
 *
 * @param props - The Frontity store (state, actions, and libraries).
 *
 * @example
 * ```js
 * <Switch>
 *   <Post when={data.isPostType} />
 * </Switch>
 * ```
 *
 * @returns The {@link Post} element rendered.
 */
const Post = ({ data }: PostProps): JSX.Element => {
  const { state, actions, libraries } = useConnect<Packages>();
  // Get the data of the post.
  const post: PostTypeEntity = state.source[data.type][data.id];
  // Get the data of the author.
  const author = state.source.author[post.author];

  // Get the html2react component.
  const Html2React = libraries.html2react.Component;

  const isNotMenuContent = !state.theme.menu.map(m => m[1]).includes(state.router.link)

  /**
   * Once the post has loaded in the DOM, prefetch both the
   * home posts and the list component so if the user visits
   * the home page, everything is ready and it loads instantly.
   */
  useEffect(() => {
    actions.source.fetch("/");
    List.preload();
  }, [actions.source]);

  // Load the post, but only if the data is ready.
  return data.isReady ? (
    <Container>
      <div>
        {isNotMenuContent && <Title dangerouslySetInnerHTML={{ __html: post.title.rendered }} />}

        {/* Only display author and date on posts */}
        {isPostEntity(post) && (
          <div>
            {author && (
              <StyledLink link={author.link}>
                <Author>
                  By <b>{author.name}</b>
                </Author>
              </StyledLink>
            )}
            <DateWrapper>
              {" "}
              on <b>{new Date(post.date).toDateString()}</b>
            </DateWrapper>
          </div>
        )}
      </div>

      {/* Look at the settings to see if we should include the featured image */}
      {state.theme.featured.showOnPost &&
        (isPostEntity(post) || isPageEntity(post)) && (
          <FeaturedMedia id={post.featured_media} />
        )}

      {isAttachmentEntity(post) && (
        // If the post is an attachment, just render the description property,
        // which already contains the thumbnail.
        <div dangerouslySetInnerHTML={{ __html: post.description?.rendered }} />
      )}

      {(isPostEntity(post) || isPageEntity(post)) && <Content html={post.content?.rendered} />}
    </Container>
  ) : null;
};

export default connect(Post);

const Container = styled.div`
  width: 800px;
  margin: 0;
  padding: 24px;

  ul, ol {
    margin: 1rem 0;
    padding: 0;
  }
  li ol, li ul {
    margin: 0;
    padding-left: 0.5rem;
    & > li {
      border-bottom: none;
      &:first-child {
        margin-top: 1rem;
      }
    }
  }
  li {
    padding: 1rem 0 1rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    list-style: none inside;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    &:first-child {
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
  }

  th, td {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 24px;
  margin-bottom: 8px;
  color: rgba(12, 17, 43);
`;

const StyledLink = styled(Link)`
  padding: 15px 0;
`;

const Author = styled.p`
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  display: inline;
`;

const DateWrapper = styled.p`
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  display: inline;
`;
