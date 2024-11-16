import React,{FunctionComponent,createContext, useContext} from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';
import { useState } from 'react';

export interface SubMenuProps{
    index?:string;
    title:string;
    className?:string;
    children?:React.ReactNode;
    // onClick?:()=>void;
}

const SubMenu:FunctionComponent<SubMenuProps> = ({index,title,className,children}) => {
    const context = useContext(MenuContext);
    const openedSubMenus = context.defaultOpenSubMenus as Array<string> //因要调用array一些方法 故用类型断言将string转为Array<string>
    const isOpen = (index &&context.mode === 'vertical' ) ? openedSubMenus.includes(index) : false 
    const [menuOpen, setmenuOpen] = useState(isOpen)
    const handleClick = (e:React.MouseEvent) => {
        e.preventDefault()
        setmenuOpen(!menuOpen)
    }
    // 令开关下拉项更丝滑
    let timer:any
    const handleMouse = (e:React.MouseEvent,toogle:boolean) => {
        clearTimeout(timer)
        e.preventDefault()
        timer = setTimeout(() => {
            setmenuOpen(toogle)
        },200)

    }
    const clickEvents = context.mode === 'vertical' ? {
        onClick: handleClick
    } : {}
    const hoverEvents = context.mode !== 'vertical' ? {
        onMouseEnter: (e:React.MouseEvent) => {handleMouse(e,true)},
        onMouseLeave: (e:React.MouseEvent) => {handleMouse(e,false)}
    }:{}

    
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'is-vertical': context.mode === 'vertical'
      })
        const renderChildren = () => { // 渲染下拉菜单内容
            const subMenuClasses = classNames('hins-submenu', {
                'menu-opened':menuOpen
            })
         const childrenComponent = React.Children.map(children, (child, i) => {
         const childElement = child as React.FunctionComponentElement<MenuItemProps>
         if (childElement.type.displayName === 'MenuItem') {
             return React.cloneElement(childElement, {index: `${index}-${i}`})
         } else {
             console.error('Warning: SubMenu has a child which is not a MenuItem component')
         }
     })
     return (
         <ul className={subMenuClasses}>
             {childrenComponent}
         </ul> 
     )
}
    return ( // 这里才是整个下拉菜单项
        <li key={index} className={classes} {...hoverEvents}>
          <div className="submenu-title"  {...clickEvents}>
            {title}
            {/* <Icon icon="angle-down" className="arrow-icon"/> */}
          </div>
          {renderChildren()}
        </li>
      )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu