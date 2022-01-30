import { connect, styled, useConnect } from "frontity";
import { Packages } from "../../types";
import Link from "./link";

/**
 * The modal containing the mobile menu items.
 *
 * @param props - The props passed to the component from parent.
 * @returns A React component.
 */
const MenuModal = ({ ...props }) => {
  const { state } = useConnect<Packages>();
  const { menu } = state.theme;
  const isThereLinks = menu?.length > 0;

  return (
    <MenuWrapper {...props}>
      {state.frontity.mode !== "amp" && <MenuOverlay />}
      <MenuContent as="nav">
        {isThereLinks &&
          menu.map(([name, link]) => (
            <MenuLink
              key={name}
              link={link}
              aria-current={state.router.link === link ? "page" : undefined}
            >
              {name}
            </MenuLink>
          ))}
      </MenuContent>
    </MenuWrapper>
  );
};

const MenuWrapper = styled.div`
  width: 100%;
  padding: 64px 0;
`;

const MenuOverlay = styled.div`
  background-color: var(--bodycolor);
  width: 100vw;
  height: 100vh;
  overflow: hidden auto;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
`;

const MenuContent = styled.div`
  z-index: 3;
  position: relative;
  width: 100%;
`;

const MenuLink = styled(Link)`
  display: inline-block;
  padding: 1.2rem 0;
  width: 100%;
  text-align: center;
  outline: 0;
  font-size: 1.1rem;
  color: var(--link-color);

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.05);
    text-decoration: none;
  }
  /* styles for active link */
  &[aria-current="page"] {
    color: var(--black);
  }
`;

export default connect(MenuModal, { injectProps: false });
