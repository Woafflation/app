import React from 'react'
import { Link } from 'react-router-dom'
import {
  Input,
  Checkboxes,
  Button,
  Panel,
  Label,
  Icon
} from '@santiment-network/ui'
import GetHypedTrends from './../../components/Trends/GetHypedTrends'
import InsightsFeatured from '../../components/Insight/InsightsFeatured'
import TrendsTable from '../../components/Trends/TrendsTable/TrendsTable'
import styles from './DashboardPage.module.scss'

const More = ({ link }) => (
  <Link to={link} className={styles.more}>
    <Label accent='jungle-green'>
      More <Icon className={styles.pointer} type='pointer-right' />
    </Label>
  </Link>
)

const DashboardPage = () => (
  <div className={styles.wrapper + ' page'}>
    <div className={styles.banner}>
      <div className={styles.banner__top}>
        <div className={styles.banner__title}>Get more power by using ...</div>
        <div className={styles.banner__description}>
          Most actual news from the world of crypto generated by cutting edge
          machine learning and artificial intelligence
        </div>
        <Button variant='fill' accent='positive'>
          Get started
        </Button>
      </div>
      <div className={styles.banner__info}>
        <div className={styles.advantages}>
          <div className={styles.advantage}>
            <div className={styles.advantage__img} />
            <div className={styles.advantage__text}>
              Actual data from the world of crypto generated by cutting edge
            </div>
          </div>
          <div className={styles.advantage}>
            <div className={styles.advantage__img} />

            <div className={styles.advantage__text}>
              Actual data from the world of crypto generated by cutting edge
            </div>
          </div>
          <div className={styles.advantage}>
            <div className={styles.advantage__img} />

            <div className={styles.advantage__text}>
              Actual data from the world of crypto generated by cutting edge
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.column}>
      <div className={styles.column__left}>
        <h2 className={styles.subtitle}>
          Emerging trends <More link='/labs/trends/' />
        </h2>
        <GetHypedTrends
          render={({ isLoading, items }) => (
            <TrendsTable
              header='Last trends'
              trend={items.length > 0 ? items[items.length - 1] : {}}
              isLoading={isLoading}
            />
          )}
        />
      </div>
      <div className={styles.column__right}>
        <h2 className={styles.subtitle}>
          Featured insights <More link='/insights/' />
        </h2>
        <div className={styles.insights}>
          <Panel className={styles.insights__panel}>
            <div className={styles.insights__list}>
              <InsightsFeatured className={styles.insights__card} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
    <div className={styles.subscription}>
      <div className={styles.subscription__title}>Better way of research</div>
      <div className={styles.subscription__text}>
        Optimal way to be informed about fresh news and summaries from the world
        of crypto
      </div>
      <form className={styles.subscription__form} action=''>
        <Input
          className={styles.subscription__input}
          placeholder='Write your email'
        />
        <Button
          variant='fill'
          accent='positive'
          className={styles.subscription__btn}
        >
          Get started
        </Button>
      </form>
      <Checkboxes
        options={['Receive product updated and weekly newsletter']}
        labelOnRight
      />
    </div>
  </div>
)

export default DashboardPage
