import { BeatLoader } from 'react-spinners';

const override = {
  display: 'flex',
  margin: '40vh auto',
  borderColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
};

function Loader() {
  return <BeatLoader color="#366CBD" margin="8px" cssOverride={override} />;
}

export default Loader;
