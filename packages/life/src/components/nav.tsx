import { connect, styled, useConnect } from "frontity";
import { Packages } from "../../types";
import Link from "./link";

/**
 * The navigation component. It renders the navigation links.
 *
 * @returns The `<nav>` tag with the menu.
 */
const Nav = (): JSX.Element => {
  const { state } = useConnect<Packages>();

  return (
    <NavContainer>
      {state.theme.menu.map(([name, link]) => {
        // Check if the link matched the current page url.
        const data = state.source.get(state.router.link);
        const isCurrentPage = data.route === link;

        return (
          <NavItem key={name}>
            {/* If link url is the current page, add `aria-current` for a11y */}
            <Link link={link} aria-current={isCurrentPage ? "page" : undefined}>
              {name}
            </Link>
          </NavItem>
        );
      })}
    </NavContainer>
  );
};

export default connect(Nav);

const NavContainer = styled.nav`
  list-style: none;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  overflow-x: auto;

  @media screen and (max-width: 560px) {
    display: none;
  }
`;

const NavItem = styled.div`
  padding: 0;
  margin: 0;
  margin-left: 1rem;
  color: var(--white);
  font-size: 1.1em;
  box-sizing: border-box;
  flex-shrink: 0;

  & > a {
    display: flex;
    flex-direction: column;
    padding: .625rem;
    text-align: center;
    border-bottom: 1px solid;
    border-bottom-color: transparent;
    /* Use for semantic approach to style the current link */
    &[aria-current="page"] {
      border-bottom-color: var(--white);
    }
  }
`;
