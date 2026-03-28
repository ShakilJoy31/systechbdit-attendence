import { apiSlice } from "@/redux/api/apiSlice";

const fileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD THUMBNAIL
    addThumbnail: builder.mutation({
      query: (data) => ({
        url: "/file/upload",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["file"],
    }),

    getGallery: builder.query({
      query: (data) => ({
        url: `/file/get-images-all?search=${data.search || ""}`,
      }),
    }),
    // DELETE FILE (for removing a file)
    deleteFile: builder.mutation({
      query: (key: string) => ({
        url: `/file/delete?key=${encodeURIComponent(key)}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["file"],
    }),
  }),
});

export const { useAddThumbnailMutation, useDeleteFileMutation, useGetGalleryQuery } = fileApi;
