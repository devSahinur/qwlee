function GigDescription({content}) {
  return (
    <div className="py-5" dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default GigDescription;
