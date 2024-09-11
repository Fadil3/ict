import { Typography } from 'antd'

const { Text } = Typography

interface DetailRowProps {
  label: string
  value: React.ReactNode
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <tr>
    <td align="left" valign="top">
      <Text type="secondary" strong>
        {label}
      </Text>
    </td>
    <td align="left">
      <Text strong>{value}</Text>
    </td>
  </tr>
)

export default DetailRow
