import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Accordion, { AccordionGroup } from "../index";

describe('Accordion', () => {
  it('opens and closes an accordion panel', () => {
    render(
      <AccordionGroup>
        <Accordion
          id="panel-a"
          renderTitle={() => <span>Panel A</span>}
          renderContent={() => <span>Content A</span>}
        />
      </AccordionGroup>,
    );

    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Panel A'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Panel A'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('keeps multiple panels open when allowMultipleOpen is enabled', () => {
    render(
      <AccordionGroup allowMultipleOpen>
        <Accordion
          id="panel-a"
          renderTitle={() => <span>Panel A</span>}
          renderContent={() => <span>Content A</span>}
        />
        <Accordion
          id="panel-b"
          renderTitle={() => <span>Panel B</span>}
          renderContent={() => <span>Content B</span>}
        />
      </AccordionGroup>,
    );

    fireEvent.click(screen.getByText('Panel A'));
    fireEvent.click(screen.getByText('Panel B'));

    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });
});
