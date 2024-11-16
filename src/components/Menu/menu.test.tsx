import React from "react";
import { fireEvent, render,RenderResult,cleanup, wait } from "@testing-library/react";
import Menu,{MenuProps} from "./menu";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";

const testProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test',
    children: <MenuItem index="0">active</MenuItem>
  }
  const testVerProps: MenuProps = {
    defaultIndex: '0',
    mode: 'vertical',
    children: <MenuItem index="0">disabled</MenuItem>
}

//渲染不同属性的组件 的函数
const generateMenu = (props: MenuProps) => {
    return (
      <Menu {...props}>
        <MenuItem >
          active
        </MenuItem>
        <MenuItem disabled >
          disabled
        </MenuItem>
        <MenuItem >
          xyz
        </MenuItem>

        <SubMenu title="dropdown">
        <MenuItem>
          drop1
        </MenuItem>
      </SubMenu>

      <SubMenu title="opened">
        <MenuItem>
          opened1
        </MenuItem>
      </SubMenu>

      </Menu>
    )
  }

  //动态给测试用例创建一个html中style样式元素 来检测默认显示下拉功能
const creatStyleFile = () =>{
  const cssFile: string = `
   .hins-submenu {
    display: none;
  }
   .hins-submenu.menu-opened {
    display: block;
    }
  `
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = cssFile
  return style
}

let wrapper: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement
describe("test Menu and MenuItem component", () => {
    //为避免在几个test case中取item重复声明 执行相同的操作，将其放在beforeEach钩子中，每个case执行前都会回调beforeEach中的逻辑
    beforeEach(() => {
        wrapper = render(generateMenu(testProps)) //测试案例要尽可能贴近使用情况 故直接渲染元素内容取得Node 而非通过class/id
        wrapper.container.append(creatStyleFile()) //将style元素添加到测试用例中
        menuElement= wrapper.getByTestId('test-menu')
        activeElement = wrapper.getByText('active')
        disabledElement = wrapper.getByText('disabled')
      })
    // 提供默认属性后是否会提供class和行为
    it("should render Menu and MenuItem based on default props", () => {
        expect(menuElement).toBeInTheDocument()
        expect(menuElement).toHaveClass('hins-menu test')
        // expect(menuElement.getElementsByTagName('li').length).toEqual(3) 查找元素是不分层级的
        //但实际要取第一层的4个节点 用:scope选择器 选择了整个Menu本身 再在其下层选仅匹配(此处是>li)的元素
        expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4)
        expect(activeElement).toHaveClass('menu-item is-active')
        expect(disabledElement).toHaveClass('menu-item is-disabled')
     })
    // 点击后是否切换到正确item，属性回调被点击是否会被触发
    it('click items should change active and call the right callback', () => {
        const thirdItem = wrapper.getByText('xyz')
        fireEvent.click(thirdItem)
        expect(thirdItem).toHaveClass('is-active')
        expect(activeElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).toHaveBeenCalledWith('2')
        fireEvent.click(disabledElement)
        expect(disabledElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
    })
    // 传入的mode为vertical 是否正确渲染对应class
    it('should render vertical mode when mode is set to vertical',()=>{
        cleanup()
        const wrapper = render(generateMenu(testVerProps))
        const menuElement = wrapper.getByTestId('test-menu')
        expect(menuElement).toHaveClass('menu-vertical')
    })

    //由于subMenu中的hover事件是一个setTimeout异步事件 需要要async函数
    it('should show dropdown items when hover on subMenu',async ()=>{
        // queryByText与getByText的区别: 前者找不到时返回null而非报错
        expect(wrapper.queryByText('drop1')).not.toBeVisible() //toBeVisible()断言元素是否可见
        const dropdownElement = wrapper.getByText('dropdown')
        fireEvent.mouseEnter(dropdownElement)
        await wait(() => { //断言被重复执行 直到timeout/报错
          expect(wrapper.queryByText('drop1')).toBeVisible()
        })
        fireEvent.click(wrapper.getByText('drop1'))
        expect(testProps.onSelect).toHaveBeenCalledWith('3-0')

        fireEvent.mouseLeave(dropdownElement)
        await wait(() => {
          expect(wrapper.queryByText('drop1')).not.toBeVisible()
        })
    })
})

// 检测纵向菜单中：点击下拉菜单项显示和 默认展开下拉菜单
describe('test Menu and MenuItem component in vertical mode',()=>{
  beforeEach(()=>{
    wrapper = render(generateMenu(testVerProps))
    wrapper.container.append(creatStyleFile())
  })
    it('should render vertical mode when mode is set to vertical',()=>{
        const menuElement = wrapper.getByTestId('test-menu')
        expect(menuElement).toHaveClass('menu-vertical')
    })
    it('should show subMenu dropdown items when click on subMenu for vertical mode',()=>{
      const dropdownElement = wrapper.queryByText('drop1')
      expect(dropdownElement).not.toBeVisible()
      fireEvent.click(wrapper.getByText('dropdown'))
      expect(dropdownElement).toBeVisible()
})
    it('should show subMenu dropdown items when defaultOpenSubMenus prop is set',()=>{
        expect(wrapper.queryByText('opened1')).toBeVisible()
    })
    
})