import React from 'react'
import { NavLink as Link } from 'react-router-dom'
import cx from 'classnames'
import Search from './../Search/SearchContainer'
import { Icon, Button } from '@santiment-network/ui'
import SmoothDropdown from '../SmoothDropdown/SmoothDropdown'
import SmoothDropdownItem from '../SmoothDropdown/SmoothDropdownItem'
import NavbarHelpDropdown from './NavbarHelpDropdown'
import NavbarLabsDropdown from './NavbarLabsDropdown'
import NavbarProfileDropdown from './NavbarProfileDropdown'
import NavbarAssetsDropdown from './NavbarAssetsDropdown'
import styles from './Navbar.module.scss'

const leftLinks = [
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/assets', label: 'Assets', linkTo: '/assets' },
  { link: '/insights', label: 'Insights' },
  { link: '/labs', label: 'Labs', linkTo: '/labs' }
]
const rightBtns = [
  {
    icon: <Icon type='help-round' />,
    el: NavbarHelpDropdown,
    links: ['/docs', '/dev-api', '/support']
  },
  {
    icon: <Icon type='profile' />,
    el: NavbarProfileDropdown,
    links: ['/account']
  }
]

const Navbar = ({ activeLink = '/' }) => {
  return (
    <header className={styles.header}>
      <SmoothDropdown
        verticalOffset={-8}
        showArrow={false}
        className={cx(styles.wrapper, 'container')}
        screenEdgeXOffset={5}
      >
        <div className={styles.left}>
          <Link className={styles.logo} to='/'>
            <svg
              width='82'
              height='16'
              viewBox='0 0 82 16'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M6.35949 0.799805C7.25282 0.799805 8.03949 0.919805 8.71949 1.1598C9.39949 1.3998 9.96615 1.6998 10.4195 2.0598C10.8728 2.41981 11.2128 2.81981 11.4395 3.25981C11.6795 3.68647 11.8128 4.09314 11.8395 4.4798C11.8528 4.63981 11.7995 4.77314 11.6795 4.8798C11.5728 4.97314 11.4462 5.0198 11.2995 5.0198H9.89949C9.67282 5.0198 9.49949 4.97981 9.37949 4.89981C9.27282 4.80647 9.17282 4.68647 9.07949 4.53981C8.87949 4.20647 8.57282 3.9198 8.15949 3.6798C7.75949 3.42647 7.15949 3.2998 6.35949 3.2998C6.01282 3.2998 5.67949 3.3398 5.35949 3.4198C5.05282 3.48647 4.77949 3.59314 4.53949 3.73981C4.31282 3.87314 4.13282 4.0398 3.99949 4.2398C3.86615 4.4398 3.79949 4.66647 3.79949 4.91981C3.79949 5.22647 3.85949 5.4798 3.97949 5.6798C4.11282 5.86647 4.32615 6.03314 4.61949 6.1798C4.92615 6.31314 5.32615 6.43981 5.81949 6.5598C6.31282 6.6798 6.92615 6.81981 7.65949 6.9798C8.45949 7.15314 9.14615 7.35981 9.71949 7.59981C10.3062 7.82647 10.7795 8.10647 11.1395 8.43981C11.5128 8.7598 11.7862 9.13314 11.9595 9.5598C12.1462 9.98647 12.2395 10.4731 12.2395 11.0198C12.2395 11.6198 12.1062 12.1798 11.8395 12.6998C11.5728 13.2065 11.1928 13.6465 10.6995 14.0198C10.2062 14.3798 9.59949 14.6665 8.87949 14.8798C8.15949 15.0931 7.35282 15.1998 6.45949 15.1998C5.71282 15.1998 4.99949 15.1131 4.31949 14.9398C3.63949 14.7531 3.03282 14.4931 2.49949 14.1598C1.97949 13.8131 1.55949 13.3998 1.23949 12.9198C0.919488 12.4398 0.739488 11.9065 0.699488 11.3198C0.686155 11.1598 0.732821 11.0331 0.839488 10.9398C0.959488 10.8331 1.09282 10.7798 1.23949 10.7798H2.63949C2.86615 10.7798 3.03949 10.8198 3.15949 10.8998C3.27949 10.9798 3.37949 11.0998 3.45949 11.2598C3.55282 11.4331 3.66615 11.6065 3.79949 11.7798C3.93282 11.9531 4.11282 12.1065 4.33949 12.2398C4.56615 12.3731 4.84616 12.4865 5.17949 12.5798C5.52615 12.6598 5.95282 12.6998 6.45949 12.6998C6.85949 12.6998 7.24615 12.6731 7.61949 12.6198C7.99282 12.5531 8.31949 12.4531 8.59949 12.3198C8.87949 12.1731 9.10616 11.9998 9.27949 11.7998C9.45282 11.5865 9.53949 11.3265 9.53949 11.0198C9.53949 10.7265 9.44615 10.4865 9.25949 10.2998C9.07282 10.1131 8.78616 9.95314 8.39949 9.81981C8.02615 9.68647 7.55949 9.5598 6.99949 9.43981C6.43949 9.31981 5.79282 9.16647 5.05949 8.9798C4.39282 8.81981 3.80615 8.63314 3.29949 8.4198C2.80615 8.19314 2.39282 7.91981 2.05949 7.59981C1.73949 7.27981 1.49949 6.90647 1.33949 6.4798C1.17949 6.0398 1.09949 5.51981 1.09949 4.91981C1.09949 4.31981 1.23282 3.76647 1.49949 3.25981C1.76615 2.75314 2.13282 2.31981 2.59949 1.95981C3.06615 1.59981 3.61949 1.31981 4.25949 1.11981C4.91282 0.906472 5.61282 0.799805 6.35949 0.799805Z' />
              <path d='M14.3482 7.15981C14.4016 6.87981 14.5216 6.57981 14.7082 6.25981C14.9082 5.93981 15.1816 5.6398 15.5282 5.35981C15.8882 5.07981 16.3216 4.85314 16.8282 4.6798C17.3482 4.49314 17.9482 4.39981 18.6282 4.39981C19.3082 4.39981 19.9216 4.49314 20.4682 4.6798C21.0149 4.85314 21.4816 5.11314 21.8682 5.45981C22.2682 5.80647 22.5749 6.24647 22.7882 6.77981C23.0016 7.29981 23.1082 7.89981 23.1082 8.57981V14.4598C23.1082 14.6065 23.0549 14.7331 22.9482 14.8398C22.8416 14.9465 22.7149 14.9998 22.5682 14.9998H21.0482C20.9016 14.9998 20.7749 14.9465 20.6682 14.8398C20.5616 14.7331 20.5082 14.6065 20.5082 14.4598V13.7998C20.2282 14.1865 19.8216 14.5198 19.2882 14.7998C18.7682 15.0665 18.1016 15.1998 17.2882 15.1998C16.7149 15.1998 16.2016 15.1265 15.7482 14.9798C15.2949 14.8198 14.9149 14.5998 14.6082 14.3198C14.3016 14.0398 14.0616 13.7131 13.8882 13.3398C13.7282 12.9531 13.6482 12.5331 13.6482 12.0798C13.6482 11.1598 13.9749 10.4398 14.6282 9.91981C15.2816 9.39981 16.1549 9.04647 17.2482 8.85981L20.5082 8.29981C20.5082 7.75314 20.3282 7.36647 19.9682 7.1398C19.6082 6.91314 19.1616 6.7998 18.6282 6.7998C18.2949 6.7998 18.0349 6.84647 17.8482 6.93981C17.6616 7.03314 17.4816 7.1598 17.3082 7.31981C17.1882 7.42647 17.0749 7.4998 16.9682 7.5398C16.8749 7.5798 16.7682 7.59981 16.6482 7.59981H14.7882C14.6549 7.59981 14.5416 7.5598 14.4482 7.4798C14.3549 7.39981 14.3216 7.29314 14.3482 7.15981ZM17.6882 12.7998C18.1416 12.7998 18.5416 12.7398 18.8882 12.6198C19.2482 12.4865 19.5482 12.3131 19.7882 12.0998C20.0282 11.8865 20.2082 11.6465 20.3282 11.3798C20.4482 11.1131 20.5082 10.8398 20.5082 10.5598V10.3598L17.7882 10.8398C17.2416 10.9331 16.8482 11.0731 16.6082 11.2598C16.3682 11.4331 16.2482 11.6731 16.2482 11.9798C16.2482 12.2598 16.3882 12.4665 16.6682 12.5998C16.9616 12.7331 17.3016 12.7998 17.6882 12.7998Z' />
              <path d='M35.534 14.4598C35.534 14.6065 35.4807 14.7331 35.374 14.8398C35.2674 14.9465 35.1407 14.9998 34.994 14.9998H33.474C33.3274 14.9998 33.2007 14.9465 33.094 14.8398C32.9874 14.7331 32.934 14.6065 32.934 14.4598V9.3798C32.934 8.5798 32.7474 7.93981 32.374 7.45981C32.0007 6.97981 31.4274 6.73981 30.654 6.73981C29.9474 6.73981 29.3874 6.97981 28.974 7.45981C28.574 7.93981 28.374 8.5798 28.374 9.3798V14.4598C28.374 14.6065 28.3207 14.7331 28.214 14.8398C28.1074 14.9465 27.9807 14.9998 27.834 14.9998H26.314C26.1674 14.9998 26.0407 14.9465 25.934 14.8398C25.8274 14.7331 25.774 14.6065 25.774 14.4598V5.1398C25.774 4.99314 25.8274 4.86647 25.934 4.7598C26.0407 4.65314 26.1674 4.5998 26.314 4.5998H27.834C27.9807 4.5998 28.1074 4.65314 28.214 4.7598C28.3207 4.86647 28.374 4.99314 28.374 5.1398V5.5998C28.7207 5.25314 29.1274 4.96647 29.594 4.73981C30.0607 4.51314 30.614 4.39981 31.254 4.39981C32.0674 4.39981 32.7474 4.52647 33.294 4.7798C33.8407 5.03314 34.2807 5.37314 34.614 5.79981C34.9474 6.22647 35.1807 6.72647 35.314 7.2998C35.4607 7.8598 35.534 8.45314 35.534 9.07981V14.4598Z' />
              <path d='M43.8159 4.39981C44.4826 4.39981 45.0826 4.53314 45.6159 4.7998C46.1626 5.05314 46.6226 5.3998 46.9959 5.8398C47.3826 6.26647 47.6826 6.76647 47.8959 7.33981C48.1226 7.89981 48.2492 8.48647 48.2759 9.0998C48.2892 9.2998 48.2959 9.53314 48.2959 9.7998C48.2959 10.0665 48.2892 10.2998 48.2759 10.4998C48.2492 11.1131 48.1226 11.7065 47.8959 12.2798C47.6826 12.8398 47.3826 13.3398 46.9959 13.7798C46.6226 14.2065 46.1626 14.5531 45.6159 14.8198C45.0826 15.0731 44.4826 15.1998 43.8159 15.1998C43.4026 15.1998 43.0292 15.1598 42.6959 15.0798C42.3759 14.9998 42.0892 14.8998 41.8359 14.7798C41.5959 14.6598 41.3892 14.5331 41.2159 14.3998C41.0426 14.2531 40.9026 14.1198 40.7959 13.9998V14.4598C40.7959 14.6065 40.7426 14.7331 40.6359 14.8398C40.5292 14.9465 40.4026 14.9998 40.2559 14.9998H38.7359C38.5892 14.9998 38.4626 14.9465 38.3559 14.8398C38.2492 14.7331 38.1959 14.6065 38.1959 14.4598V1.3398C38.1959 1.19314 38.2492 1.06647 38.3559 0.959805C38.4626 0.853138 38.5892 0.799805 38.7359 0.799805H40.2559C40.4026 0.799805 40.5292 0.853138 40.6359 0.959805C40.7426 1.06647 40.7959 1.19314 40.7959 1.3398V5.5998C40.9026 5.4798 41.0426 5.35314 41.2159 5.2198C41.3892 5.07314 41.5959 4.93981 41.8359 4.81981C42.0892 4.69981 42.3759 4.59981 42.6959 4.5198C43.0292 4.4398 43.4026 4.39981 43.8159 4.39981ZM45.6759 9.23981C45.5959 8.37314 45.3292 7.75314 44.8759 7.37981C44.4226 6.99314 43.8692 6.7998 43.2159 6.7998C42.5626 6.7998 42.0092 6.9998 41.5559 7.39981C41.1159 7.79981 40.8626 8.34647 40.7959 9.03981C40.7692 9.23981 40.7559 9.49314 40.7559 9.7998C40.7559 10.1065 40.7692 10.3598 40.7959 10.5598C40.8626 11.2798 41.1159 11.8331 41.5559 12.2198C42.0092 12.6065 42.5626 12.7998 43.2159 12.7998C43.8692 12.7998 44.4226 12.6131 44.8759 12.2398C45.3292 11.8531 45.5959 11.2265 45.6759 10.3598C45.7159 9.98647 45.7159 9.61314 45.6759 9.23981Z' />
              <path d='M50.5787 7.15981C50.632 6.87981 50.752 6.57981 50.9387 6.25981C51.1387 5.93981 51.412 5.6398 51.7587 5.35981C52.1187 5.07981 52.552 4.85314 53.0587 4.6798C53.5787 4.49314 54.1787 4.39981 54.8587 4.39981C55.5387 4.39981 56.152 4.49314 56.6987 4.6798C57.2454 4.85314 57.712 5.11314 58.0987 5.45981C58.4987 5.80647 58.8054 6.24647 59.0187 6.77981C59.232 7.29981 59.3387 7.89981 59.3387 8.57981V14.4598C59.3387 14.6065 59.2854 14.7331 59.1787 14.8398C59.072 14.9465 58.9454 14.9998 58.7987 14.9998H57.2787C57.132 14.9998 57.0054 14.9465 56.8987 14.8398C56.792 14.7331 56.7387 14.6065 56.7387 14.4598V13.7998C56.4587 14.1865 56.052 14.5198 55.5187 14.7998C54.9987 15.0665 54.332 15.1998 53.5187 15.1998C52.9454 15.1998 52.432 15.1265 51.9787 14.9798C51.5254 14.8198 51.1454 14.5998 50.8387 14.3198C50.532 14.0398 50.292 13.7131 50.1187 13.3398C49.9587 12.9531 49.8787 12.5331 49.8787 12.0798C49.8787 11.1598 50.2054 10.4398 50.8587 9.91981C51.512 9.39981 52.3854 9.04647 53.4787 8.85981L56.7387 8.29981C56.7387 7.75314 56.5587 7.36647 56.1987 7.1398C55.8387 6.91314 55.392 6.7998 54.8587 6.7998C54.5254 6.7998 54.2654 6.84647 54.0787 6.93981C53.892 7.03314 53.712 7.1598 53.5387 7.31981C53.4187 7.42647 53.3054 7.4998 53.1987 7.5398C53.1054 7.5798 52.9987 7.59981 52.8787 7.59981H51.0187C50.8854 7.59981 50.772 7.5598 50.6787 7.4798C50.5854 7.39981 50.552 7.29314 50.5787 7.15981ZM53.9187 12.7998C54.372 12.7998 54.772 12.7398 55.1187 12.6198C55.4787 12.4865 55.7787 12.3131 56.0187 12.0998C56.2587 11.8865 56.4387 11.6465 56.5587 11.3798C56.6787 11.1131 56.7387 10.8398 56.7387 10.5598V10.3598L54.0187 10.8398C53.472 10.9331 53.0787 11.0731 52.8387 11.2598C52.5987 11.4331 52.4787 11.6731 52.4787 11.9798C52.4787 12.2598 52.6187 12.4665 52.8987 12.5998C53.192 12.7331 53.532 12.7998 53.9187 12.7998Z' />
              <path d='M67.6645 12.0198C67.6645 11.8731 67.6178 11.7531 67.5245 11.6598C67.4312 11.5665 67.2645 11.4798 67.0245 11.3998C66.7978 11.3198 66.4912 11.2398 66.1045 11.1598C65.7178 11.0798 65.2245 10.9731 64.6245 10.8398C64.0378 10.7065 63.5512 10.5398 63.1645 10.3398C62.7778 10.1398 62.4645 9.90647 62.2245 9.6398C61.9978 9.37314 61.8378 9.07314 61.7445 8.73981C61.6512 8.39314 61.6045 8.01981 61.6045 7.61981C61.6045 7.21981 61.6978 6.82647 61.8845 6.43981C62.0712 6.05314 62.3378 5.71314 62.6845 5.4198C63.0445 5.11314 63.4778 4.86647 63.9845 4.6798C64.4912 4.49314 65.0712 4.39981 65.7245 4.39981C66.3778 4.39981 66.9578 4.47314 67.4645 4.6198C67.9845 4.76647 68.4245 4.95981 68.7845 5.19981C69.1445 5.43981 69.4245 5.71981 69.6245 6.03981C69.8245 6.34647 69.9378 6.65981 69.9645 6.9798C69.9778 7.12647 69.9245 7.25314 69.8045 7.35981C69.6978 7.46647 69.5712 7.5198 69.4245 7.5198H67.8845C67.6845 7.5198 67.5312 7.48647 67.4245 7.41981C67.3312 7.33981 67.2245 7.25314 67.1045 7.15981C66.9845 7.06647 66.8245 6.98647 66.6245 6.91981C66.4245 6.83981 66.1245 6.7998 65.7245 6.7998C65.3245 6.7998 64.9712 6.85981 64.6645 6.9798C64.3578 7.0998 64.2045 7.31314 64.2045 7.61981C64.2045 7.76647 64.2378 7.89314 64.3045 7.99981C64.3845 8.09314 64.5245 8.17981 64.7245 8.25981C64.9378 8.33981 65.2245 8.42647 65.5845 8.51981C65.9578 8.59981 66.4378 8.69981 67.0245 8.81981C68.2112 9.07314 69.0445 9.47314 69.5245 10.0198C70.0178 10.5531 70.2645 11.2198 70.2645 12.0198C70.2645 12.4198 70.1645 12.8131 69.9645 13.1998C69.7645 13.5731 69.4712 13.9131 69.0845 14.2198C68.7112 14.5131 68.2445 14.7531 67.6845 14.9398C67.1378 15.1131 66.5178 15.1998 65.8245 15.1998C65.1178 15.1998 64.4912 15.1198 63.9445 14.9598C63.4112 14.7865 62.9578 14.5665 62.5845 14.2998C62.2112 14.0331 61.9245 13.7331 61.7245 13.3998C61.5245 13.0665 61.4178 12.7398 61.4045 12.4198C61.3912 12.2731 61.4378 12.1465 61.5445 12.0398C61.6645 11.9331 61.7978 11.8798 61.9445 11.8798H63.4845C63.6845 11.8798 63.8312 11.9265 63.9245 12.0198C64.0312 12.1131 64.1445 12.2198 64.2645 12.3398C64.3978 12.4598 64.5778 12.5665 64.8045 12.6598C65.0312 12.7531 65.3712 12.7998 65.8245 12.7998C66.0245 12.7998 66.2312 12.7865 66.4445 12.7598C66.6578 12.7331 66.8512 12.6931 67.0245 12.6398C67.2112 12.5731 67.3645 12.4931 67.4845 12.3998C67.6045 12.2931 67.6645 12.1665 67.6645 12.0198Z' />
              <path d='M71.8751 9.7998C71.8751 9.05314 71.9884 8.35314 72.2151 7.69981C72.4418 7.03314 72.7684 6.45981 73.1951 5.9798C73.6218 5.48647 74.1351 5.0998 74.7351 4.81981C75.3484 4.5398 76.0285 4.39981 76.7751 4.39981C77.5218 4.39981 78.1951 4.5398 78.7951 4.81981C79.4084 5.08647 79.9284 5.45314 80.3551 5.91981C80.7818 6.37314 81.1084 6.91314 81.3351 7.5398C81.5751 8.15314 81.6951 8.7998 81.6951 9.4798V10.3798C81.6951 10.5265 81.6418 10.6531 81.5351 10.7598C81.4285 10.8665 81.3018 10.9198 81.1551 10.9198H74.4751C74.4751 11.2265 74.5351 11.4998 74.6551 11.7398C74.7884 11.9665 74.9618 12.1598 75.1751 12.3198C75.3885 12.4798 75.6351 12.5998 75.9151 12.6798C76.1951 12.7598 76.4818 12.7998 76.7751 12.7998C77.2018 12.7998 77.5484 12.7598 77.8151 12.6798C78.0818 12.5865 78.3018 12.4731 78.4751 12.3398C78.6218 12.2331 78.7418 12.1598 78.8351 12.1198C78.9284 12.0798 79.0551 12.0598 79.2151 12.0598H80.8151C80.9618 12.0598 81.0884 12.1131 81.1951 12.2198C81.3151 12.3265 81.3685 12.4531 81.3551 12.5998C81.3418 12.7865 81.2351 13.0265 81.0351 13.3198C80.8484 13.6131 80.5618 13.8998 80.1751 14.1798C79.7885 14.4598 79.3084 14.6998 78.7351 14.8998C78.1751 15.0998 77.5218 15.1998 76.7751 15.1998C76.0285 15.1998 75.3484 15.0731 74.7351 14.8198C74.1351 14.5531 73.6218 14.1798 73.1951 13.6998C72.7684 13.2198 72.4418 12.6531 72.2151 11.9998C71.9884 11.3331 71.8751 10.5998 71.8751 9.7998ZM76.7751 6.7998C76.3885 6.7998 76.0551 6.85981 75.7751 6.9798C75.5084 7.08647 75.2818 7.23314 75.0951 7.41981C74.9084 7.59314 74.7618 7.79314 74.6551 8.0198C74.5618 8.23314 74.5018 8.43981 74.4751 8.6398H78.9951C78.9685 8.43981 78.9151 8.23314 78.8351 8.0198C78.7684 7.79314 78.6484 7.59314 78.4751 7.41981C78.3151 7.23314 78.0951 7.08647 77.8151 6.9798C77.5484 6.85981 77.2018 6.7998 76.7751 6.7998Z' />
            </svg>
          </Link>

          {leftLinks.map(({ link, label, linkTo }) => {
            if (linkTo) {
              return (
                <SmoothDropdownItem
                  key={label}
                  trigger={
                    <Button
                      variant='flat'
                      className={styles.btn}
                      isActive={activeLink.includes(link)}
                      as={props => <Link {...props} to={linkTo} />}
                    >
                      {label}
                    </Button>
                  }
                >
                  {label === 'Assets' && (
                    <NavbarAssetsDropdown activeLink={activeLink} />
                  )}
                  {label === 'Labs' && (
                    <NavbarLabsDropdown activeLink={activeLink} />
                  )}
                </SmoothDropdownItem>
              )
            }

            return (
              <Button
                key={link}
                variant='flat'
                as={props => <Link {...props} to={{ pathname: link }} />}
                isActive={activeLink.includes(link)}
                className={styles.leftLink}
              >
                {label}
              </Button>
            )
          })}
        </div>

        <div className={styles.right}>
          <Search />
          {rightBtns.map(({ icon, el: Content, links }, index) => {
            return (
              <SmoothDropdownItem
                key={index}
                trigger={
                  <Button
                    variant='flat'
                    className={cx(styles.btn, styles.rightBtns)}
                    isActive={links.includes(activeLink)}
                  >
                    {icon}
                  </Button>
                }
              >
                <Content activeLink={activeLink} />
              </SmoothDropdownItem>
            )
          })}
        </div>
      </SmoothDropdown>
    </header>
  )
}

export default Navbar
