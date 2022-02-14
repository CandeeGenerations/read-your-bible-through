import styled from '@emotion/styled'
import dayjs from 'dayjs'

const Footer = () => {
  const year = dayjs().format('YYYY')

  return (
    <>
      <Border className="relative" />

      <FooterWrapper className="relative flex items-center content-between lg:pb-20 pb-32 lg:flex-row flex-col">
        <div className="flex-grow pb-16 lg:pb-0 text-center lg:text-left">
          A Ministry of{' '}
          <a href="https://cbcwoodbridge.org" target="_blank">
            Central Baptist Church
          </a>
        </div>

        <div className="flex flex-grow-0">
          &copy; 2022{year !== '2022' && ` - ${year}`}&nbsp;
          <a
            href="https://candeegenerations.com?ref=readyourbiblethrough.com"
            target="_blank"
          >
            Candee Generations
          </a>
        </div>
      </FooterWrapper>

      {/*<NavigationMain footer />*/}
    </>
  )
}

const Border = styled.div`
  margin: 140px auto 50px;
  border-bottom: 1px solid rgba(8, 8, 11, 0.15);
`

const FooterWrapper = styled.div`
  color: #73737d;
`

export default Footer
