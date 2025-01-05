import { Circle } from 'better-react-spinkit';

function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div>
        <img
          src="/img/ChitChat.jpg"
          alt="Whats app logos"
          height={200}
          style={{ marginBottom: 10 }}
        ></img>
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
