import Link from '@frontity/components/link';
import {
  isAttachmentEntity,
  isPageEntity
} from "@frontity/source";
import { HomeData, PostTypeData, PostTypeEntity } from "@frontity/source/types";
import { connect, styled, useConnect } from "frontity";
import { useEffect } from "react";
import { Packages } from "../../../types";
import Content from "../content";
import FeaturedMedia from "../featured-media";
import List from "../list";

interface HomeProps {
  /**
   * Data element representing a URL in your frontity site.
   */
  data: HomeData & Partial<PostTypeData>;

  /**
   * Whether to render this component.
   */
  when?: boolean;
}

/**
 * @param props - The Frontity store (state, actions, and libraries).
 *
 * @example
 * ```js
 * <Switch>
 *   <Home when={data.isPostType} />
 * </Switch>
 * ```
 *
 * @returns The {@link Home} element rendered.
 */
const Home = connect(({ data }: HomeProps): JSX.Element => {
  const { state, actions } = useConnect<Packages>();
  // Get the data of the post.
  const post: PostTypeEntity = state.source[data.type][data.id];

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
      {/* Look at the settings to see if we should include the featured image */}
      {state.theme.featured.showOnPost && isPageEntity(post) && (
          <FeaturedMedia id={post.featured_media} />
        )}

      {isAttachmentEntity(post) && (
        // If the post is an attachment, just render the description property,
        // which already contains the thumbnail.
        <div dangerouslySetInnerHTML={{ __html: post.description?.rendered }} />
      )}

      {isPageEntity(post) && <Content html={post.content?.rendered} />}

      <ButtonList>
        {state.theme.menu.map(([name, link]) => {
          return (link !== state.router.link && <ButtonListItem>
            <NeumorphismButton link={link}>
              {name}
            </NeumorphismButton>
          </ButtonListItem>)
        })}
      </ButtonList>
    </Container>
  ) : null;
});

export default Home;

const Container = styled.div`
  width: 800px;
  margin: 0;
  padding: 24px;
`;

const ButtonList = styled.div`
  padding-top: 48px;
`;

const ButtonListItem = styled.div`
  padding-bottom: 48px;
`;

const NeumorphismButton = styled(Link)`
  color: var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100%px);
  min-width: 16rem;
  min-height: 15rem;
  border-radius: 50px;
  background-color: #e0e0e0;
  text-decoration: none;
  font-size: 3rem;
  text-align: center;

  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  -webkit-box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  a {
    text-decoration: none;
    color: var(--black);
    margin-right: 100;
  }
`;
