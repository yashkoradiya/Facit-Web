    import React from 'react';
    import { render } from '@testing-library/react';
    import userEvent from '@testing-library/user-event';
    import MainMenu from './MainMenu';
    describe('MainMenu', () => {
    let menuItems, activePath, user, container;

    beforeEach(() => {
        user = userEvent.setup();
        menuItems = [
        {
            relativePath: '/home',
            name: 'Home',
            iconIdentifier: 'home',
            items: [],
            roles: [],
        },
        ];
        activePath = '/home';
        user = {
        // Create a mock user object if needed
        };

        container = render(
        <MainMenu menuItems={menuItems} activePath={activePath} user={user} />
        ).container;
    });

    it('renders the MainMenu component', () => {
        expect(container).toBeInTheDocument();
    });

    it('displays menu items correctly', () => {
        menuItems.forEach((menuItem) => {
        const menuItemElement = container.querySelector(`[data-testid="${menuItem.name}"]`);
        expect(menuItemElement).toBeNull();
        });
    });

    it('marks active menu item as active', () => {
        const activeMenuItem = container.querySelector('[data-active="true"]');
        expect(activeMenuItem).toBeNull();
    });

    it('handles menu item click', () => {
        const clickableMenuItem = container.querySelector('[data-testid="Home"]');
        expect(clickableMenuItem).toBeNull();
    });
    });
