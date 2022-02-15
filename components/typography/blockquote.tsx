import styled from '@emotion/styled'

const Blockquote = styled.blockquote`
  transition: background 0.25s ease-in-out, color 0.25s ease-in-out;
  margin: 15px auto 50px;
  color: #08080b;
  font-family: 'Merriweather', Georgia, serif;
  font-style: italic;

  @media (max-width: 735px) {
    margin: 10px auto 35px;
  }

  & > footer {
    max-width: 880px !important;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding-left: 16px;
    }

    @media (max-width: 540px) {
      padding: 0 20px;
    }
  }

  & > p {
    font-family: 'Merriweather', Georgia, serif;
    max-width: 880px !important;
    padding-right: 100px;
    padding-bottom: 0;
    width: 100%;
    margin: 0 auto;
    font-size: 36px;
    line-height: 1.32;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 26px;
      padding-left: 16px;
    }

    @media (max-width: 640px) {
      font-size: 20px;
    }
  }
`

export default Blockquote
