import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Logo from "../components/Logo";
import { get_objects, ObjectData } from "../utils/data";
import { BigLinkButton } from "../components/Buttons";
export function useObjects(): [string | null, ObjectData[] | null] {
  const params = useParams();
  const address = params.address || null;
  const navigate = useNavigate();
  useEffect(() => {
    if (address === null) {
      navigate("/");
    }
  }, [address, navigate]);
  if (address === null) {
    return ["", null];
  }
  const objects = get_objects(address);
  return [address, objects];
}

export default function Information(): JSX.Element {
  const [address, objects] = useObjects();
  if (address == null) {
    return <></>;
  }
  if (objects === null || objects.length === 0) {
    return <></>;
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          alignContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <div style={{ flexGrow: 1 }} />
          <Logo />
          <p>
            Am Standort <b>{address}</b> befinden sich folgende Liegenschaften:
          </p>
          <table>
            <tr>
              <th>Bereich</th>
              <th>User</th>
              <th>Größe</th>
            </tr>
            {objects.map((data) => (
              <>
                <tr>
                  <td>{data.area}</td>
                  <td>{data.user}</td>
                  <td>{data.size}</td>
                </tr>
              </>
            ))}
          </table>
          <BigLinkButton
            to={`/`}
            content={"Zurück zum Start"}
            appearance={"primary"}
          />
        </div>
      </div>
    </>
  );
}
