import styled from "styled-components";
import { useSpring, animated, config } from "react-spring";

import BurgerMenu from "./burger-menu";
import CollapseMenu from "./collapse-menu";
import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

export interface NavbarProps {
  navbarState: boolean;
  handleNavbar: () => void;
  startLoading?: () => void;
}

const Navbar = () => {
  const [navbarState, setNavbarState] = useState(false);

  const handleNavbar = () => setNavbarState(!navbarState);

  const barAnimation = useSpring({
    from: { transform: "translate3d(0, -10rem, 0)" },
    transform: "translate3d(0, 0, 0)",
  });

  const linkAnimation = useSpring({
    from: { transform: "translate3d(0, 30px, 0)", opacity: 0 },
    to: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    delay: 800,
    config: config.wobbly,
  });

  return (
    <>
      <NavBar style={barAnimation}>
        <FlexContainer>
          <Link to="/">Streaming System</Link>
          <NavLinks style={linkAnimation}>
            <NavLink href="/">Profile</NavLink>
            <NavLink href="/streams">Streams</NavLink>
          </NavLinks>
          <BurgerWrapper>
            <BurgerMenu navbarState={navbarState} handleNavbar={handleNavbar} />
          </BurgerWrapper>
        </FlexContainer>
      </NavBar>
      <CollapseMenu navbarState={navbarState} handleNavbar={handleNavbar} />
    </>
  );
};

export default Navbar;

const NavLink = ({
  children,
  href,
}: {
  children: React.ReactChild;
  href: string;
}) => {
  const history = useHistory();

  const onLinkClick = () => {
    history.push({ pathname: href });
  };
  return (
    <li>
      <span onClick={onLinkClick}>
        {children}
      </span>
    </li>
  );
};

const NavBar = styled(animated.nav)`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  font-size: 1.4rem;
  background-color: #3335b8;
  transition: all 0.1s ease;
  color: #fff;
`;

const NavbarTitle = styled.h3`
  color: #fff;
  font-size: 1.75rem;
  line-height: 1.2;
  text-transform: uppercase;
  font-weight: 600;
  border-bottom: 1px solid transparent;
  display: block;
  /* margin-top: 1.25rem; */
  /* margin-bottom: 0.5rem; */
  /* margin-right: auto; */
  min-width: 16rem;
  text-decoration: none;
  transition: all 0.1s ease;
  & :hover {
    text-decoration: none;
    color: #fff;
  }

  /* transition: all 300ms linear 0s; */
`;

const FlexContainer = styled.div`
  max-width: 120rem;
  display: flex;
  flex-grow: 1;
  margin: auto;
  padding-left: 1.5rem;
  justify-content: space-between;
  height: 5rem;

  & a {
    text-decoration: none;
    color: inherit;
    margin: auto 0;
    padding-bottom: 0.5rem;
    font-weight: bold;
    font-size: 2rem;
  }
`;

const NavLinks = styled(animated.ul)`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-self: end;
  list-style-type: none;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 1rem;
  margin-right: 0.5rem;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  padding-left: 0;
  list-style: none;

  & li {
    padding-right: 0;
    padding-left: 0;
  }

  & span {
    text-transform: uppercase;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    margin: 0 1.5rem;
    transition: all 0.1s ease;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: #ffc71f;
      border-bottom: 1px solid #fdcb6e;
    }

    @media (max-width: 800px) {
      display: none;
    }
  }
`;

const BurgerWrapper = styled.div`
  margin: auto 0;
  margin-left: auto;
  margin-right: 1rem;

  @media (min-width: 800px) {
    display: none;
  }
`;
