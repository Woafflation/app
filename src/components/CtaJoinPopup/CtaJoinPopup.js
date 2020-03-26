import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Button from '@santiment-network/ui/Button'
import Dialog from '@santiment-network/ui/Dialog'
import Panel from '@santiment-network/ui/Panel'
import { PATHS } from '../../App'
import { checkIsLoggedIn } from '../../pages/UserSelectors'
import styles from './CtaJoinPopup.module.scss'

const TIMEOUT = 2 * 60 * 1000

let timeoutId = null

const CtaJoinPopup = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return null
  }

  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    timeoutId = setTimeout(() => {
      if (!isLoggedIn) {
        setOpen(true)
      }
    }, TIMEOUT)

    return () => {
      timeoutId && clearTimeout(timeoutId)
    }
  }, [])

  return (
    <Dialog
      title=''
      open={isOpen}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      classes={styles}
    >
      <Panel padding className={styles.container}>
        <svg
          width='99'
          height='81'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M73.265 32.24c-5.336-2.224-2.224 6.67 0 11.394.523 1.154 1.945 7.226 0 13.34-1.946 6.115-6.948 5.003-12.229 9.45-5.28 4.447-9.171-1.667-16.12 2.78-7.26 4.646-9.17 3.335-15.84 3.335-6.671 0-15.009-.556-18.066 2.779C7.953 78.653 1.283 74.206.171 77.54s3.335 4.447 9.172 2.502c5.836-1.946 10.005-.278 19.732-2.502 9.727-2.223 9.171.834 21.122-2.223 11.95-3.057 17.231-4.447 23.068-8.894 5.836-4.447 6.392-12.507 7.504-16.12 1.111-3.613-.834-15.286-7.504-18.065z'
            fill='var(--porcelain)'
          />
          <path
            d='M30.353 67.091c.389-.333 2.334 5.726 2.334 5.726s-8.06 1.667-12.45 1.39c-4.392-.279-2.669-4.392-3.447-7.005-1.445-.722-2.445-2.557-1.5-4.224 1.389-2.446 2.89-4.892 4.446-7.226.167-.39.334-.834.5-1.223 1.168-3.169 5.392-2.502 5.726.778.444 4.224 1.111 8.894 4.39 11.784zM73.82 46.97c-.834-4.447-1.756-3.913-3.057-5.56-1.302-1.645.497-5.079 0-6.392-.995-2.625-2.457-5.558-3.636-7.226-1.18-1.667-5.871-7.035-8.956-7.226-3.085-.19-9.602-2.14-12.936 4.37-5.323 4.148-5.672 15.962-4.478 21.58 3.54 16.814 20.766 22.194 26.37 17.129 5.604-5.066 7.527-12.229 6.693-16.676zm-15.649 9.523c.597-1.26 1.194-2.468 1.94-3.623.2-.315 1.195-1.365 1.244-2.047.349.367.747.787.946.892.895.525 1.84.788 2.835.683a3.702 3.702 0 0 0 1.99-.735c-.348 2.257-.994 4.62-2.587 6.038-.497.315-.995.578-1.492.84-.15.105-.348.158-.498.263-1.741.42-3.731-.158-5.423-1.05.398-.21.747-.63 1.045-1.26zm-11.493-20.53c0-1.628.1-3.256.348-4.884.647.263 1.393.316 2.09.053 2.488-.893 4.328.315 4.975 2.31-.746 1.103-1.691 2.206-1.99 2.678a15.267 15.267 0 0 0-1.393 2.52c-.398-.472-.746-.944-1.144-1.417-.846-1.103-1.89-1.47-2.886-1.26z'
            fill='var(--jungle-green-accent)'
          />
          <path
            d='M69.207 11.394c-1.168.668-1.723 1.89-3.002 2.335-1.167.39-2.501.39-3.724.167-1.334-.223-2.557 1.056-1.779 2.334a6.25 6.25 0 0 0 6.392 3.113c2.446-.333 5.837-2.112 6.226-4.836.333-2.223-1.834-4.447-4.113-3.113zM86.217 5.502c-.778-.055-1.445.278-2.112.612-.167.055-.278.167-.445.222l-.445.111a4.301 4.301 0 0 0-.889.39c-.055.055-.389.222-.167.11-.667.334-1.39.779-1.334 1.613.111 1.723 1.89 2.668 3.447 2.723 1.89.112 3.835-.722 4.446-2.612.445-1.612-.945-3.113-2.501-3.169zM89.83 44.301c-1.001-.278-1.724.222-2.502.834.333-.278-.5.334-.445.334-.111.11-.222.222-.278.333-.222-.056-.722-.222-.89-.278-.166-.056-.61-.278-1-.445-.833-.333-2.112.39-2.279 1.279-.389 2.39 1.39 4.336 3.725 4.614 2.39.277 5.113-1.335 5.336-3.892.055-1.111-.445-2.39-1.668-2.779z'
            fill='var(--porcelain)'
          />
          <path
            d='M96.833 36.13c-.611 0-1.278-.556-1.278-1.5v-.168c0-.555.333-.833.5-.944a.822.822 0 0 1 .722-.223.758.758 0 0 1 .834 0c.445.278.723.778.723 1.334 0 .834-.667 1.501-1.5 1.501z'
            fill='var(--mirage)'
          />
          <path
            d='M71.765 35.185c.444-.222.611-.667.444-1.112-2.89-6.726-7.782-12.117-12.673-14.063-2.057-.834-4.002-1.278-5.892-1.39h-.778c-5.725 0-9.338 3.502-11.34 6.448-2.445 3.558-3.835 8.283-3.835 12.952 0 12.618 8.95 30.183 23.457 30.183 8.449 0 14.118-10.283 14.063-19.844 0-1.834-.167-3.669-.445-5.503'
            stroke='var(--mirage)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M43.417 23.234c-6.56 7.838-12.284 15.675-18.343 23.957-4.058 5.503-8.17 11.173-12.618 16.843-1.39 1.779-2.779 3.502-4.113 5.17a213.348 213.348 0 0 0-6.337 8.115.842.842 0 0 0-.055.945c.167.222.445.389.722.389h.167l59.865-10.672M18.626 75.318c-1.612-2.78-3.836-7.17-4.892-12.396'
            stroke='var(--mirage)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M34.134 73.094a.793.793 0 0 1-.667-.333c-5.391-7.726-8.504-16.842-8.504-25.07M55.756 45.19c.89-2.445 3.224-4.224 5.614-4.224 1.223 0 1.779.556 2.223.945.39.334.612.611 1.501.611.89 0 1.279-.555 1.946-1.667.778-1.223 1.667-2.78 4.002-2.78.166 0 .389.056.667.112.333.055.778.167 1.222.167 1.39 0 2.669-.779 3.447-2.002M63.926 58.865c-.278 0-.556-.112-.89-.278-.555-.278-1.556-.723-3.557-1.279-.389-.11-.667-.5-.611-.89a.842.842 0 0 1-.056-.944c.778-1.223 1.223-2.057 1.557-2.668.389-.778.667-1.279 1.223-1.39.61-.167 1.056.167 1.834.667.556.39 1.445.945 2.779 1.668.222.11.39.333.445.556a.91.91 0 0 1-.112.667c-1.056 1.556-1.39 2.445-1.5 2.89-.111.39-.278.778-.723.945-.111.056-.278.056-.389.056zM49.809 35.74c-1.557 0-2.78-1.166-2.78-2.723 0-1.5.945-3.557 2.668-3.39.945.11 1.78.555 2.446 1.39.334.444.556 1.11.556 1.778 0 1.445-1.167 2.946-2.89 2.946zM87.106 48.359c-.779 0-1.501-.611-2.724-1.612-.334-.278-.723-.611-1.167-.945a.792.792 0 0 1-.334-.667c-.055-.056-.111-.056-.167-.111-.333-.334-.278-.89.056-1.168 1.39-1.278 1.834-2.279 2.168-2.946.278-.5.5-1 1.056-1.167.722-.167 1.223.222 2.89 1.445.445.334 1 .779 1.668 1.223.333.223.444.723.222 1.056l-.5 1c-1.334 2.502-1.89 3.558-2.89 3.78-.056.112-.167.112-.278.112zM74.154 28.126c0-3.335 2.557-7.06 6.281-7.06 1.279 0 2.001.779 2.001 2.113 0 .277-.055.555-.055.833 0 .223-.056.445-.056.667 0 .89.778 1.279 1.056 1.279.834 0 1.501-1.279 2.168-2.557.945-1.834 2.112-4.113 4.614-4.113.833 0 1.5.722 1.5 1.556 0 .167 0 .39-.055.611 0 .187-.056.369-.056.556.89-.11 1.668-.945 2.39-1.723M65.871 16.397c-.167 0-.334-.055-.445-.11a17.46 17.46 0 0 0-1.056-.668c-1.278-.778-2.446-1.556-3.724-2.279-.39-.222-.556-.723-.334-1.112.056-.166.223-.278.334-.333.056-.167.167-.278.334-.39 1.612-1.945 2.334-3.112 2.723-3.89.39-.667.667-1.056 1.223-1.168.556-.11.89.223 1.39.612.611.556 1.723 1.5 4.224 2.78a.86.86 0 0 1 .445.61c.055.278 0 .5-.167.723-.056.056-4.169 4.836-4.28 4.947-.111.111-.222.223-.39.278h-.277zM83.548 8.06c-.89 0-1.723-.39-2.335-1.001-.667-.556-1.111-1.445-1.111-2.502C80.102 2.834 81.324 1 83.103 1h.556c1.667 0 3.28 1.779 3.28 3.613.055 2.112-1.724 3.446-3.391 3.446zM87.994 55.53l.5.166c1.557.556 5.17 1.835 6.837 1.835.167 0 .334 0 .556-.056'
            stroke='var(--mirage)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        <div className={styles.join}>Join our community!</div>
        <div className={styles.description}>
          Santiment provides custom metrics, insights metrics and data-driven
          strategies on 900+ cryptocurrencies.
        </div>
        <Button
          as={Link}
          to={PATHS.CREATE_ACCOUNT}
          variant='fill'
          accent='positive'
          className={styles.btn}
        >
          Start crypto journey
        </Button>
      </Panel>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  isLoggedIn: checkIsLoggedIn(state)
})

export default connect(mapStateToProps)(CtaJoinPopup)
