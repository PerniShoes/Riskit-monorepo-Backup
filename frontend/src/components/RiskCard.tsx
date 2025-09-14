import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Risk = {
  risk: string
  probability: number
}

export default function RiskCard({ risk }: { risk: Risk | null }) {
  if (!risk) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No data</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Risk: {risk.risk}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Probability: {(risk.probability * 100).toFixed(1)}%
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
      </CardActions>
    </Card>
  )
}
