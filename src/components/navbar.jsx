import { NavLink } from 'react-router-dom'


const sty = {
    // navbar: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     position: 'fixed',
    //     width: '100vw',
    //     height: 50,
    //     backdropFilter: 'saturate(180%) blur(20px)',
    //     backgroundColor: 'rgba(255, 255, 255, 0.72)',
    //     zIndex: 1,
    //     border: '1px solid #CECECF',
    //     borderWidth: 0,
    //     borderBottomWidth: '1px'
    // },
    navbarInner: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nav: {
        textDecoration: 'none',
        color: 'var(--primary-tint)',
        margin: '0 7px',
        fontSize: 20,
        fontVariationSettings: '"wght" 500',
        borderRadius: '10px',
    },
    activeNav: {
        textDecoration: 'none',
        color: 'var(--tertiary-label)',
        margin: '0 7px',
        fontSize: 20,
        fontVariationSettings: '"wght" 600'
    },
    button: {
        borderRadius: '10px',
        backgroundColor: 'var(--primary-fill)',
        border: 'none',
        padding: '7px',
        margin: '10px',
    }
}


export const Navbar = () => {

    return (
        // <div style={sty.navbar}>
            <nav style={sty.navbarInner}>
                <div>
                    <button style={sty.button}>
                        <NavLink to={'/calc1'} style={({ isActive }) => isActive ? sty.activeNav : sty.nav}>Calc 1</NavLink>
                    </button>
                    <button style={sty.button}>
                        <NavLink to={'/calc2'} style={({ isActive }) => isActive ? sty.activeNav : sty.nav}>Calc 2</NavLink>
                    </button>
                    <button style={sty.button}>
                        <NavLink to={'/calc3'} style={({ isActive }) => isActive ? sty.activeNav : sty.nav}>Calc 3</NavLink>
                    </button>
                    <button style={sty.button}>
                        <NavLink to={'/calc4'} style={({ isActive }) => isActive ? sty.activeNav : sty.nav}>Calc 4</NavLink>
                    </button>
                    <button style={sty.button}>
                        <NavLink to={'/calc5'} style={({ isActive }) => isActive ? sty.activeNav : sty.nav}>Calc 5</NavLink>
                    </button>
                </div>
            </nav>
        // </div>
    )
}