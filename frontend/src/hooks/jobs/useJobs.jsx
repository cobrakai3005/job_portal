import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../../data-access/index";

/*
   GET ALL JOBS
*/

export const useJobs = ({ search, page }) => {
  return useQuery({
    queryKey: ["jobs", search, page],
    queryFn: () => getAllJobs({ search }),
  });
};

/*
   GET SINGLE JOB
*/

export const useJob = (id) => {
  return useQuery({
    queryKey: ["job", id],

    queryFn: () => getJobById(id),

    enabled: !!id,
  });
};

/*
   CREATE JOB
*/

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
};

/*
   UPDATE JOB
*/

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job", variables.id],
      });
    },
  });
};

/*
   DELETE JOB
*/

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
};
