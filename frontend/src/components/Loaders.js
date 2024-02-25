// Author: Oskari Niskanen
import React from 'react'
import ContentLoader from 'react-content-loader'

const DetailsMainCardLoader = (props) => (
  <ContentLoader
    speed={1}
    width={400}
    height={260}
    viewBox="0 0 400 260"
    backgroundColor="#f3f3f3"
    foregroundColor="#80a4ff"
    {...props}
  >
    <rect x="3" y="7" rx="3" ry="3" width="265" height="10" />
    <rect x="3" y="27" rx="3" ry="3" width="147" height="9" />
    <rect x="3" y="92" rx="3" ry="3" width="63" height="8" />
    <rect x="3" y="48" rx="3" ry="3" width="147" height="9" />
    <rect x="3" y="74" rx="3" ry="3" width="55" height="7" />
    <rect x="3" y="111" rx="3" ry="3" width="55" height="8" />
    <rect x="3" y="196" rx="3" ry="3" width="96" height="13" />
    <rect x="3" y="238" rx="3" ry="3" width="222" height="9" />
    <rect x="3" y="176" rx="3" ry="3" width="97" height="13" />
    <rect x="3" y="149" rx="3" ry="3" width="110" height="14" />
    <rect x="113" y="74" rx="3" ry="3" width="55" height="7" />
    <rect x="113" y="89" rx="3" ry="3" width="63" height="8" />
    <rect x="213" y="74" rx="3" ry="3" width="55" height="7" />
    <rect x="213" y="89" rx="3" ry="3" width="63" height="8" />
    <rect x="213" y="107" rx="3" ry="3" width="55" height="8" />
    <rect x="313" y="107" rx="3" ry="3" width="55" height="8" />
    <rect x="313" y="74" rx="3" ry="3" width="55" height="7" />
    <rect x="113" y="110" rx="3" ry="3" width="55" height="8" />
    <rect x="313" y="89" rx="3" ry="3" width="63" height="8" />
  </ContentLoader>
)

const MiniCardLoader = (props) => (
  <ContentLoader
    speed={1}
    width={400}
    height={90}
    viewBox="0 0 400 90"
    backgroundColor="#f3f3f3"
    foregroundColor="#80a4ff"
    {...props}
  >
    <rect x="0" y="6" rx="3" ry="3" width="265" height="13" />
    <rect x="0" y="33" rx="3" ry="3" width="147" height="9" />
    <rect x="0" y="48" rx="3" ry="3" width="71" height="29" />
    <rect x="6" y="104" rx="3" ry="3" width="88" height="9" />
    <rect x="0" y="84" rx="3" ry="3" width="97" height="11" />
    <rect x="190" y="33" rx="3" ry="3" width="147" height="9" />
    <rect x="190" y="48" rx="3" ry="3" width="71" height="29" />
    <rect x="193" y="104" rx="3" ry="3" width="88" height="9" />
    <rect x="190" y="84" rx="3" ry="3" width="97" height="11" />
  </ContentLoader>
)

const ChartLoader = (props) => (
  <ContentLoader
    speed={1}
    width={600}
    height={180}
    viewBox="0 0 600 180"
    backgroundColor="#f3f3f3"
    foregroundColor="#80a4ff"
    {...props}
  >
    <rect x="0" y="4" rx="3" ry="3" width="265" height="12" />
    <rect x="0" y="49" rx="3" ry="3" width="550" height="107" />
    <rect x="462" y="30" rx="3" ry="3" width="88" height="12" />
    <rect x="0" y="162" rx="3" ry="3" width="265" height="12" />
  </ContentLoader>
)

const DetailsMapLoader = (props) => (
  <ContentLoader
    speed={1}
    width={700}
    height={300}
    viewBox="0 0 700 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#80a4ff"
    {...props}
  >
    <rect x="0" y="3" rx="3" ry="3" width="265" height="12" />
    <rect x="0" y="57" rx="3" ry="3" width="680" height="227" />
    <rect x="0" y="20" rx="3" ry="3" width="49" height="7" />
    <rect x="0" y="40" rx="3" ry="3" width="49" height="7" />
    <rect x="0" y="30" rx="3" ry="3" width="49" height="7" />
  </ContentLoader>
)

export { DetailsMainCardLoader, MiniCardLoader, ChartLoader, DetailsMapLoader }
