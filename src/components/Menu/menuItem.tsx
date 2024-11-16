import React, { useContext } from 'react'
import classNames from 'classnames'
import { MenuContext } from './menu';    


export interface MenuItemProps {
    index?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }
  
  const MenuItem: React.FC<MenuItemProps> = (props) => {
    const { index, disabled, className, style, children } = props
    const context = useContext(MenuContext)
    const classes = classNames('menu-item', className, {
      'is-disabled': disabled,
      'is-active': context.index === index
    })
    const handleClick = () => {
      if (context.onSelect && !disabled && typeof index === 'string') { //没使用cloneElement把index传进去 导致下拉项点击时无法触发alert事件
        context.onSelect(index)
      }
    }
    return (
      <li className={classes} style={style} onClick={handleClick}>
        {children}
      </li>
    )
  }
  
  MenuItem.displayName = 'MenuItem' //Reactname 的静态属性判断类型 
  export default MenuItem