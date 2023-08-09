export default function Suggestions({suggestions}: {suggestions: any[]}) {
    return <div>
        {suggestions.map((prop, i) => {
          if (!prop["should_be_changed"]) {
            return null;
          }
          if (Array.isArray(prop["new_content"])) {
            return (
              <div key={i}>
                <strong>{prop["title"]}: </strong>
                {prop["new_content"].map((e, i) => {
                  if(e.name) {
                    return (
                      <div className="ml-2" key={e.name}>
                        <div>
                          <strong>Name: </strong>{e.name}
                        </div>
                        <div className="ml-2">
                          <strong>Description: </strong>{e.description}
                        </div>
                        <div className="ml-2">
                          <strong>Characteristics goals: </strong>{e.characteristics_goals}
                        </div>
                      </div>
                    );
                  } else {
                    return <span key={prop["title"] + i}>{e}&nbsp;</span>
                  }
                })}
              </div>
            );
          } else {
            return (<div key={i}>
              <strong>{prop["title"]}: </strong>
              {prop["new_content"]}
            </div>)
          }
        })}
    </div>
}