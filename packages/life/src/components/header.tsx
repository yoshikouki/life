import { connect, styled, useConnect } from "frontity";
import { Packages } from "../../types";
import Link from "./link";
import MobileMenu from "./menu";
import Nav from "./nav";

/**
 * The header of the site, showing the title and description, and the nav bar.
 *
 * @returns The header element.
 */
const Header = () => {
  const { state } = useConnect<Packages>();
  const { menu, isMobileMenuOpen } = state.theme;

  return (
    <>
      <Container>
        {!isMobileMenuOpen && (
          <StyledLink link="/">
            <Title>{state.frontity.title}</Title>
          </StyledLink>
        )}
        <MobileMenu />
        <Nav />
      </Container>
    </>
  );
};

export default connect(Header);

const Container = styled.div`
  width: 848px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 24px;
  color: var(--white);
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  height: 2rem;
  vertical-align: middle;
  display: inline
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;
