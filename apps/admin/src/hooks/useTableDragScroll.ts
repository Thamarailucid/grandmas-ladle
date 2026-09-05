import { useEffect } from 'react';

/**
 * useTableDragScroll
 * Enables horizontal click-and-drag scrolling as well as mouse-wheel horizontal scrolling
 * across all Ant Design tables throughout the admin dashboard.
 *
 * Automatically excludes interactive elements (buttons, switches, links, inputs, selects,
 * dropdowns, popconfirms) so regular interactions are never blocked.
 */
export function useTableDragScroll() {
  useEffect(() => {
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let activeContainer: HTMLElement | null = null;
    let hasDragged = false;

    const interactiveSelector = [
      'button',
      'a',
      'input',
      'textarea',
      'select',
      'label',
      '.ant-switch',
      '.ant-btn',
      '.ant-select',
      '.ant-select-selector',
      '.ant-select-dropdown',
      '.ant-popconfirm',
      '.ant-popover',
      '.ant-tooltip',
      '.ant-dropdown-trigger',
      '.ant-checkbox-wrapper',
      '.ant-radio-wrapper',
      '.ant-pagination',
      '.ant-table-filter-trigger',
      '.ant-table-column-sorter',
      '[role="button"]',
      '[role="switch"]',
      '[data-no-drag]'
    ].join(', ');

    const handleMouseDown = (e: MouseEvent) => {
      // Only handle primary left click
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore interactive controls
      if (target.closest(interactiveSelector)) {
        return;
      }

      // Find scrollable table container
      const container = target.closest('.ant-table-content, .ant-table-body') as HTMLElement | null;
      if (!container || container.scrollWidth <= container.clientWidth + 1) {
        return;
      }

      isDown = true;
      hasDragged = false;
      activeContainer = container;
      startX = e.pageX;
      startY = e.pageY;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown || !activeContainer) return;

      const dx = e.pageX - startX;
      const dy = e.pageY - startY;

      // Threshold to distinguish regular click from drag
      if (!hasDragged) {
        if (Math.abs(dx) > 3) {
          hasDragged = true;
          document.body.classList.add('table-drag-scrolling');
          activeContainer.classList.add('table-is-dragging');
        } else if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          // Vertical movement dominates, cancel so vertical page scroll is preserved
          isDown = false;
          activeContainer = null;
          return;
        }
      }

      if (hasDragged) {
        activeContainer.scrollLeft = scrollLeft - dx;
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (hasDragged) {
        // Prevent accidental click events right after dragging
        const preventClick = (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          window.removeEventListener('click', preventClick, true);
        };
        window.addEventListener('click', preventClick, true);
        setTimeout(() => window.removeEventListener('click', preventClick, true), 60);
      }

      isDown = false;
      hasDragged = false;
      if (activeContainer) {
        activeContainer.classList.remove('table-is-dragging');
        activeContainer = null;
      }
      document.body.classList.remove('table-drag-scrolling');
    };

    // Support mouse wheel scrolling horizontally when hovering over a wide table
    const handleWheel = (e: WheelEvent) => {
      // If user holds Shift, browser already scrolls horizontally
      if (e.shiftKey) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const container = target.closest('.ant-table-content, .ant-table-body') as HTMLElement | null;
      if (!container || container.scrollWidth <= container.clientWidth + 1) {
        return;
      }

      // Check if user is scrolling vertically with the mouse wheel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const canScrollRight = e.deltaY > 0 && container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
        const canScrollLeft = e.deltaY < 0 && container.scrollLeft > 1;

        if (canScrollRight || canScrollLeft) {
          container.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheel);
      document.body.classList.remove('table-drag-scrolling');
    };
  }, []);
}
