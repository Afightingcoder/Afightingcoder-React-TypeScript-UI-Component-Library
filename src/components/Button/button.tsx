import React,{ FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import classNames from 'classnames';

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
    className?: string;
    disabled?: boolean;
    size?: ButtonSize;
    btnType?: ButtonType;
    children: React.ReactNode;
    href?: string;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: React.FC<ButtonProps> = (props) => {
    const { //es6的对象展开
        btnType,
        className,
        disabled,
        size,
        children,
        href,
        ...restProps
        } = props

    // 传入字符串和对象 因对象key是变化故用[]包着模板字符串
    const classes = classNames('btn', className,{
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': (btnType === 'link') && disabled //本身无该属性 要添加上
    })

    //主体部分
    if (btnType === 'link') {
        return (
            <a className={classes} href={props.href} {...restProps} >{children}</a>
        )
    } else {
        return (
            <button className={classes} disabled={disabled} {...restProps}>{children}</button>
        )
    }
}

Button.defaultProps = { 
    disabled: false,
    btnType: 'default'
}
export default Button