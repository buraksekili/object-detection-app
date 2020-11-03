import { Button, Nav, Text } from "grommet";
import { Blog, Github } from "grommet-icons";
import React from "react";

const Navbar = () => {
  return (
    <Nav direction="row" background="nav">
      <Button
        href="https://github.com/buraksekili/object-detection-app"
        icon={<Github />}
        target="_blank"
        hoverIndicator
      />
      <Button
        href="http://buraksekili.github.io/"
        icon={<Blog />}
        target="_blank"
        hoverIndicator
      />
      <Text alignSelf="center" textAlign="center">
        Object Detection App
      </Text>
    </Nav>
  );
};

export default Navbar;
