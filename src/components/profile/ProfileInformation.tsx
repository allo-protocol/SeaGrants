const ProfileInformation = (props: { register: any; errors: any }) => {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          A profile will be created on the registry to maintain your project.
          Additonally an anchor wallet would be created which will be controlled
          by the profile. The anchor creation requires a nonce unique to the
          owner. You can use the anchor wallet to recive funds , gather
          attestations and generate reputation for your project.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        <div className="sm:col-span-full">
          <label
            htmlFor="profile-owner"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Profile Owner
          </label>
          <div className="mt-2">
            <input
              {...props.register("profileOwner")}
              type="text"
              name="profileOwner"
              id="profileOwner"
              placeholder=" 0x..."
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            {props.errors.profileOwner && (
              <Error message={props.errors.profileOwner?.message!} />
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="nonce"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nonce
          </label>
          <div className="mt-2">
            <input
              {...props.register("nonce")}
              type="number"
              name="nonce"
              id="nonce"
              defaultValue={1}
              placeholder="1"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            {props.errors.nonce && (
              <Error message={props.errors.nonce?.message!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
