import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import BurgerMenu from '../burger-menu'

test ('should render', () => {
    const res = shallow(<BurgerMenu navbarState={false} handleNavbar={() => null}/>)
    expect(toJson(res)).toMatchSnapshot()
})

test ('should have correct className', () => {
    const res = shallow(<BurgerMenu navbarState={true} handleNavbar={() => null}/>)
    expect(!res.find('div.open')).toBe(false)
})